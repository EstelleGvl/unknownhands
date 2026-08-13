const fs = require('fs');
const path = require('path');

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Optimization: Cache the database in memory between serverless invocations if container is reused
let cachedDb = null;

function resolveEmbeddingsPath() {
  const candidates = [
    path.resolve(__dirname, '../../data/rag_data/colophon_embeddings.json'),
    path.resolve(__dirname, '../data/rag_data/colophon_embeddings.json'),
    path.resolve(process.cwd(), 'data/rag_data/colophon_embeddings.json'),
    '/var/task/data/rag_data/colophon_embeddings.json'
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Embeddings database not found on server. Checked: ${candidates.join(', ')}`);
  }
  return found;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

  try {
    const body = JSON.parse(event.body);
    const query = body.query;
    
    if (!query) throw new Error('Missing query parameter');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API Key missing. Please ensure GEMINI_API_KEY is set in Netlify.');

    // 1. Get embedding for the query
    const embedRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: { parts: [{ text: query }] },
        task_type: "retrieval_query"
      })
    });
    
    if (!embedRes.ok) {
      if (embedRes.status === 429) throw new Error("RATE_LIMIT");
      throw new Error(`Embedding API failed: ${embedRes.statusText}`);
    }
    const embedData = await embedRes.json();
    const queryVector = embedData.embedding.values;

    // 2. Load vectors and calculate similarity efficiently
    if (!cachedDb) {
      const dataPath = resolveEmbeddingsPath();
      cachedDb = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    // Mathematical sort in place
    for (let i = 0; i < cachedDb.length; i++) {
      cachedDb[i].similarity = cosineSimilarity(queryVector, cachedDb[i].embedding);
    }
    cachedDb.sort((a, b) => b.similarity - a.similarity);

    // Limit context window to 30. 
    // 150 was causing a Netlify Serverless Function 10-second timeout.
    // 30 is enough to get cross-variances without crashing the runtime memory.
    const topResults = cachedDb.slice(0, 30);
    
    let contextText = "Here are historically translated medieval book colophons from our database. Analyze ALL of them before answering:\n\n";
    topResults.forEach((r, i) => {
       // Omit the raw coordinate vector to radically shrink payload to Gemini
       contextText += `[Manuscript: ${r.manuscript_title}]\nMetadata Context: ${r.context}\nText: ${r.text}\n\n`;
    });

    const sysPrompt = `You are an AI assistant analyzing medieval manuscript colophons. DO NOT adopt a persona, DO NOT pretend to be an archivist, and DO NOT add conversational filler. Answer directly and professionally.

IMPORTANT: You have been provided with a large sample of relevant manuscript excerpts containing dense relational metadata (Monasteries, Religious Orders, Scribe Genders, Texts Copied). Synthesize the information across the manuscripts that match the query. If comparing two things (like Cistercian vs Dominican), make sure to scour the metadata context tags to find examples of both!

CONTEXT:
${contextText}

Question: "${query}"`;

    // 3. Generate Answer
    const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: sysPrompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });

    if (!genRes.ok) {
      if (genRes.status === 429) throw new Error("RATE_LIMIT");
      throw new Error(`Text generation failed: ${genRes.statusText}`);
    }
    const genData = await genRes.json();
    if (!genData.candidates || genData.candidates.length === 0) {
       throw new Error("Text generation timed out or failed to return text.");
    }
    const finalAnswer = genData?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim();
    if (!finalAnswer) {
       throw new Error("Text generation returned an empty response.");
    }

    // Return unique sources that were explicitly given to the AI
    const uniqueSources = [];
    const seenTitles = new Set();
    topResults.forEach(r => {
      if (!seenTitles.has(r.manuscript_title)) {
        seenTitles.add(r.manuscript_title);
        uniqueSources.push({ title: r.manuscript_title, id: r.chunk_id });
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer: finalAnswer, sources: uniqueSources })
    };
  } catch (error) {
    console.error("Backend Error:", error);
    if (error.message === "RATE_LIMIT") {
      return { 
        statusCode: 429, 
        headers, 
        body: JSON.stringify({ error: "The chatbot is currently experiencing high traffic and hit a rate limit. Please wait about 60 seconds and try your question again." }) 
      };
    }
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
