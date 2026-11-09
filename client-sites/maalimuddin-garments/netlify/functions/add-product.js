// Serverless function: receives a product from the owner's upload app,
// commits the image(s) + a new product entry into data.js on GitHub.
// Netlify rebuilds automatically, so the product goes live in ~1 minute.
// Secrets come from Netlify env vars: GITHUB_TOKEN, ADMIN_PASSWORD.

const OWNER = 'jonnyraj123';
const REPO = 'Propnest';
const BRANCH = 'claude/zen-einstein-cxl6p1';
const DIR = 'client-sites/maalimuddin-garments';
const API = 'https://api.github.com';

const SIZEMAP = { small: 'SMALL', regular: 'REG', skirt: 'SKIRT', big: 'BIG' };

function pad(n) { return String(n).padStart(2, '0'); }

async function gh(path, opts = {}) {
  const r = await fetch(API + path, {
    ...opts,
    headers: {
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'maa-upload-app',
      ...(opts.headers || {}),
    },
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch (e) { data = text; }
  if (!r.ok) throw new Error('GitHub ' + r.status + ': ' + (data && data.message ? data.message : text).slice(0, 200));
  return data;
}

exports.handler = async (event) => {
  const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  try {
    if (!process.env.GITHUB_TOKEN) throw new Error('Server not configured: GITHUB_TOKEN missing');
    const body = JSON.parse(event.body || '{}');

    // 1. password check
    if (!process.env.ADMIN_PASSWORD || body.password !== process.env.ADMIN_PASSWORD) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Wrong password' }) };
    }

    // 2. validate
    const name = (body.name || '').trim();
    const cat = (body.cat || '').trim();
    const colours = (body.colours || []).filter(Boolean).slice(0, 3);
    const images = (body.images || []).slice(0, 4); // each: {full, small} base64 (no prefix)
    const sizeKey = SIZEMAP[body.sizes] ? body.sizes : 'regular';
    if (!name || !cat || !images.length) throw new Error('Name, category and at least one photo are required');

    // 3. read current data.js (content + sha)
    const file = await gh(`/repos/${OWNER}/${REPO}/contents/${DIR}/assets/data.js?ref=${BRANCH}`);
    const dataSrc = Buffer.from(file.content, 'base64').toString('utf8');

    // 4. find next image number
    let maxN = 1;
    const re = /img:\s*\[([0-9,\s]+)\]/g; let m;
    while ((m = re.exec(dataSrc))) m[1].split(',').forEach(x => { const v = parseInt(x); if (v > maxN) maxN = v; });
    const nums = images.map((_, i) => maxN + 1 + i);

    // 5. build updated data.js (insert new product before the closing "];")
    const id = 'up-' + (maxN + 1);
    const col = colours.length ? colours.map(c => `'${c.replace(/'/g, '')}'`).join(', ') : 'ABC';
    const colVal = colours.length ? `[${col}]` : 'ABC';
    const entry = `  { id: '${id}', name: '${name.replace(/'/g, '')}', cat: '${cat}', img: [${nums.join(', ')}], sizes: ${SIZEMAP[sizeKey]}, colours: ${colVal}, tag: 'New' }`;
    const idx = dataSrc.lastIndexOf('\n];');
    if (idx === -1) throw new Error('data.js format error');
    const newData = dataSrc.slice(0, idx) + ',\n' + entry + dataSrc.slice(idx);

    // 6. make blobs
    const refObj = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    const latest = refObj.object.sha;
    const commitObj = await gh(`/repos/${OWNER}/${REPO}/git/commits/${latest}`);
    const baseTree = commitObj.tree.sha;

    const tree = [];
    // data.js blob
    const dataBlob = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: newData, encoding: 'utf-8' }) });
    tree.push({ path: `${DIR}/assets/data.js`, mode: '100644', type: 'blob', sha: dataBlob.sha });
    // images
    for (let i = 0; i < images.length; i++) {
      const n = nums[i];
      const full = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: images[i].full, encoding: 'base64' }) });
      tree.push({ path: `${DIR}/img/p/p${pad(n)}.webp`, mode: '100644', type: 'blob', sha: full.sha });
      const small = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: images[i].small || images[i].full, encoding: 'base64' }) });
      tree.push({ path: `${DIR}/img/p/p${pad(n)}-s.webp`, mode: '100644', type: 'blob', sha: small.sha });
    }

    // 7. tree -> commit -> move ref
    const newTree = await gh(`/repos/${OWNER}/${REPO}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: baseTree, tree }) });
    const newCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits`, { method: 'POST', body: JSON.stringify({ message: 'Add product via app: ' + name, tree: newTree.sha, parents: [latest] }) });
    await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit.sha }) });

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, name, id }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: String(e.message || e) }) };
  }
};
