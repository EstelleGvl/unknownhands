// A very small proxy that fetches a remote URL and returns it with permissive CORS.
// Works for JSON manifests and also other content types.
// Deployed automatically by Netlify when pushed to main.

export async function handler(event) {
  const url = (event.queryStringParameters || {}).url;
  if (!url) {
    return { statusCode: 400, body: 'Missing ?url=' };
  }

  try {
    // Fetch the remote resource
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'UnknownHands-IIIF-Proxy/1.0' }
    });

    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await resp.arrayBuffer());

    // Pass through status, set CORS + content type
    return {
      statusCode: resp.status,
      isBase64Encoded: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      },
      body: buffer.toString('base64')
    };
  } catch (e) {
    return { statusCode: 502, body: 'Proxy fetch failed: ' + e.message };
  }
}