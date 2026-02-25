// Railway serverless function to proxy Gemini API calls
// Keeps API key secure on server side
// Set GEMINI_API_KEY in Railway environment variables

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set in environment variables');
    return res.status(500).json({ 
      error: 'Server configuration error: API key not set' 
    });
  }

  // Parse request
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }

  // Build Gemini prompt
  const prompt = `You are a search query parser for a historical manuscript database. 

The database contains these record types:
- Manuscript: historical manuscripts (books, codices)
- Monastery: monastic institutions
- Institution: holding institutions (libraries, archives)
- Person: historical people (scribes, authors)
- Text: texts/works

Available fields for filtering:
- type: record type (Manuscript, Monastery, Institution, Person, Text)
- title: record title
- city: location city
- country: location country
- date: date or date range (format: YYYY or YYYY-YYYY)
- order: religious order (Dominican, Franciscan, Benedictine, etc.)
- author: author name
- institution: institution name

User query: "${query}"

Parse this query and return ONLY a JSON object with filters to apply. Return filters only for explicitly mentioned criteria.

Examples:
Query: "manuscripts from the 15th century"
Response: {"type": "Manuscript", "dateRange": [1400, 1499]}

Query: "Dominican monasteries in Germany"
Response: {"type": "Monastery", "order": "Dominican", "country": "Germany"}

Query: "texts by Augustine"
Response: {"type": "Text", "author": "Augustine"}

Query: "manuscripts from Deventer"
Response: {"type": "Manuscript", "city": "Deventer"}

Query: "15th century Dominican manuscripts from Bruges"
Response: {"type": "Manuscript", "dateRange": [1400, 1499], "order": "Dominican", "city": "Bruges"}

Now parse the user's query and return ONLY the JSON object with filters:`;

  // Call Gemini API
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048  // Increased for semantic analysis
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return res.status(response.status).json({ 
        error: 'AI service error: ' + (error.error?.message || 'Unknown error') 
      });
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text.trim();
    
    // Extract JSON from response - be robust
    let jsonText = text;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '');
    
    // Find the JSON object - get everything between first { and last }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    
    let filters = {};
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      filters = JSON.parse(jsonText);
    }

    return res.status(200).json({ filters });

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process query: ' + error.message 
    });
  }
}
