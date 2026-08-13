const { randomUUID } = require('crypto');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const allowedReasons = new Set([
  'wrong_grapheme',
  'bad_crop',
  'not_text',
  'later_addition',
  'uncertain',
  'other'
]);

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function getFlagStore() {
  try {
    const { getStore } = require('@netlify/blobs');
    return getStore('fingerprint-crop-flags');
  } catch (error) {
    throw new Error('Netlify Blobs is not available. Run npm install locally and redeploy so @netlify/blobs is installed.');
  }
}

function normalizeFlag(body) {
  const reason = String(body.reason || '').trim();
  if (!allowedReasons.has(reason)) {
    throw new Error('Please choose a valid flag reason.');
  }

  const cropId = String(body.crop_id || '').trim();
  const image = String(body.image || '').trim();
  if (!cropId || !image) {
    throw new Error('Missing crop metadata.');
  }

  return {
    id: randomUUID(),
    submitted_at: new Date().toISOString(),
    crop_id: cropId,
    reason,
    comment: String(body.comment || '').slice(0, 1000),
    reviewer_email: String(body.reviewer_email || '').slice(0, 200),
    scribe_id: String(body.scribe_id || ''),
    scribe_title: String(body.scribe_title || ''),
    scribe_url: String(body.scribe_url || ''),
    grapheme: String(body.grapheme || ''),
    grapheme_key: String(body.grapheme_key || ''),
    manuscript_title: String(body.manuscript_title || ''),
    manuscript_slug: String(body.manuscript_slug || ''),
    image,
    canvas: String(body.canvas || ''),
    xywh: Array.isArray(body.xywh) ? body.xywh.join(',') : String(body.xywh || ''),
    page_index: String(body.page_index || ''),
    source: String(body.source || ''),
    coordinate_level: String(body.coordinate_level || ''),
    quality: String(body.quality || ''),
    user_agent: String(body.user_agent || '').slice(0, 400)
  };
}

async function listFlags(store) {
  const listing = await store.list();
  const flags = [];
  for (const blob of listing.blobs || []) {
    const flag = await store.get(blob.key, { type: 'json' });
    if (flag) flags.push(flag);
  }
  return flags.sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)));
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = await getFlagStore();

    if (event.httpMethod === 'GET') {
      const expectedToken = process.env.FINGERPRINT_FLAGS_ADMIN_TOKEN;
      const providedToken = (event.queryStringParameters || {}).token || event.headers['x-admin-token'];
      if (!expectedToken || providedToken !== expectedToken) {
        return jsonResponse(401, { error: 'Flag exports require FINGERPRINT_FLAGS_ADMIN_TOKEN.' });
      }

      const flags = await listFlags(store);
      const format = (event.queryStringParameters || {}).format || 'json';
      if (format === 'csv') {
        const columns = [
          'id', 'submitted_at', 'reason', 'comment', 'reviewer_email', 'crop_id',
          'scribe_id', 'scribe_title', 'scribe_url', 'grapheme', 'grapheme_key',
          'manuscript_title', 'manuscript_slug', 'image', 'canvas', 'xywh',
          'page_index', 'source', 'coordinate_level', 'quality', 'user_agent'
        ];
        const lines = [columns.join(',')].concat(
          flags.map((flag) => columns.map((column) => csvEscape(flag[column])).join(','))
        );
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8' },
          body: lines.join('\n')
        };
      }
      return jsonResponse(200, { count: flags.length, flags });
    }

    if (event.httpMethod !== 'POST') {
      return jsonResponse(405, { error: 'Method Not Allowed' });
    }

    const body = JSON.parse(event.body || '{}');
    const flag = normalizeFlag(body);
    await store.setJSON(`${flag.submitted_at.slice(0, 10)}/${flag.id}.json`, flag);
    return jsonResponse(200, { ok: true, flag_id: flag.id });
  } catch (error) {
    return jsonResponse(400, { error: error.message });
  }
};
