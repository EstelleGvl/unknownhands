// Proxy public HTTPS IIIF resources with CORS for browser viewers.
// Private-network and localhost targets are rejected to avoid SSRF abuse.

const dns = require('dns').promises;
const net = require('net');

const MAX_RESPONSE_BYTES = 20 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const ALLOWED_PROTOCOL = 'https:';
const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);
const STATIC_IMAGE_FALLBACK_HOSTS = new Set(['online-service.nuernberg.de']);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range'
};

function isPrivateIPv4(address) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0
  );
}

function isPrivateIPv6(address) {
  const normalized = address.toLowerCase();
  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  );
}

function isBlockedAddress(address) {
  const version = net.isIP(address);
  if (version === 4) return isPrivateIPv4(address);
  if (version === 6) return isPrivateIPv6(address);
  return true;
}

function getAllowedHosts() {
  return String(process.env.IIIF_PROXY_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

async function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL.');
  }

  if (parsed.protocol !== ALLOWED_PROTOCOL) {
    throw new Error('Only HTTPS IIIF resources can be proxied.');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new Error('This host is not allowed.');
  }

  const allowedHosts = getAllowedHosts();
  if (allowedHosts.length > 0 && !allowedHosts.includes(hostname)) {
    throw new Error('This IIIF host is not in IIIF_PROXY_ALLOWED_HOSTS.');
  }

  if (net.isIP(hostname)) {
    if (isBlockedAddress(hostname)) throw new Error('Private network addresses are not allowed.');
    return parsed.toString();
  }

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((entry) => isBlockedAddress(entry.address))) {
    throw new Error('Private network addresses are not allowed.');
  }

  return parsed.toString();
}

async function readLimitedResponse(resp) {
  const contentLength = Number(resp.headers.get('content-length') || 0);
  if (contentLength > MAX_RESPONSE_BYTES) {
    throw new Error('Remote resource is too large.');
  }

  const reader = resp.body?.getReader();
  if (!reader) return Buffer.from(await resp.arrayBuffer());

  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      throw new Error('Remote resource is too large.');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

function rewriteStaticImageServices(buffer, contentType) {
  if (!contentType.toLowerCase().includes('json')) return buffer;

  let manifest;
  try {
    manifest = JSON.parse(buffer.toString('utf8'));
  } catch {
    return buffer;
  }

  const canvases = (manifest.sequences || []).flatMap((sequence) => sequence.canvases || []);
  canvases.forEach((canvas) => {
    (canvas.images || []).forEach((annotation) => {
      const resource = annotation && annotation.resource;
      const service = resource && (Array.isArray(resource.service) ? resource.service[0] : resource.service);
      const serviceId = service && (service.id || service['@id']);
      if (!serviceId) return;

      let serviceHost = '';
      try {
        serviceHost = new URL(serviceId).hostname.toLowerCase();
      } catch {
        return;
      }
      if (!STATIC_IMAGE_FALLBACK_HOSTS.has(serviceHost)) return;

      resource['@id'] = `${String(serviceId).replace(/\/+$/, '')}/full/1800,/0/default.jpg`;
      delete resource.service;
    });
  });

  return Buffer.from(JSON.stringify(manifest));
}

async function fetchValidatedUrl(rawUrl, options = {}) {
  let currentUrl = rawUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const safeUrl = await validateUrl(currentUrl);
    const response = await fetch(safeUrl, { ...options, redirect: 'manual' });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return response;
    }

    if (redirectCount === MAX_REDIRECTS) {
      throw new Error('Remote resource redirected too many times.');
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new Error('Remote resource returned a redirect without a destination.');
    }

    currentUrl = new URL(location, safeUrl).toString();
  }

  throw new Error('Remote resource redirected too many times.');
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Method Not Allowed'
    };
  }

  const url = (event.queryStringParameters || {}).url;
  if (!url) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Missing ?url='
    };
  }

  try {
    const resp = await fetchValidatedUrl(url, {
      headers: { 'User-Agent': 'UnknownHands-IIIF-Proxy/1.0' }
    });

    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    let buffer = await readLimitedResponse(resp);
    if ((event.queryStringParameters || {}).staticImages === '1') {
      buffer = rewriteStaticImageServices(buffer, contentType);
    }

    return {
      statusCode: resp.status,
      isBase64Encoded: true,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      },
      body: buffer.toString('base64')
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Proxy fetch failed: ' + e.message
    };
  }
};
