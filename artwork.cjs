const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const extensions = new Set(['.png', '.jpg', '.jpeg', '.pdf', '.ai', '.eps', '.zip']);
function decodeArtwork(artwork) {
  if (!artwork || typeof artwork.fileName !== 'string' || typeof artwork.data !== 'string') throw Object.assign(new Error('Invalid artwork attachment.'), { status: 400 });
  const extension = path.extname(artwork.fileName).toLowerCase();
  if (!extensions.has(extension)) throw Object.assign(new Error('Artwork must be a PNG, JPG, PDF, AI, EPS or ZIP file.'), { status: 400 });
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(artwork.data)) throw Object.assign(new Error('Artwork could not be read.'), { status: 400 });
  const buffer = Buffer.from(artwork.data, 'base64');
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) throw Object.assign(new Error('Artwork must be between 1 byte and 8 MB.'), { status: 413 });
  return { buffer, extension };
}
async function saveArtwork(directory, artwork) {
  const { buffer, extension } = decodeArtwork(artwork);
  const fileName = `${crypto.randomUUID()}${extension}`;
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, fileName), buffer, { flag: 'wx' });
  return { fileName, url: `/api/artwork/${fileName}` };
}
function registerArtwork(app, { pool, requireAccount, requireDb, isAdminRequest, directory }) {
  app.get('/api/artwork/:fileName', requireAccount, requireDb, async (req, res, next) => {
    try {
      if (!/^[a-f0-9-]{36}\.(png|jpe?g|pdf|ai|eps|zip)$/.test(req.params.fileName)) return res.status(404).json({ error: 'Artwork not found.' });
      if (!isAdminRequest(req)) {
        const [rows] = await pool.query("SELECT id FROM quotations WHERE LOWER(user_email) = ? AND JSON_UNQUOTE(JSON_EXTRACT(options_json, '$.artworkFile')) = ? LIMIT 1", [req.customer.email.toLowerCase(), `/api/artwork/${req.params.fileName}`]);
        if (!rows.length) return res.status(404).json({ error: 'Artwork not found.' });
      }
      res.setHeader('Cache-Control', 'private, no-store');
      res.download(path.join(directory, req.params.fileName), error => { if (error && !res.headersSent) { if (error.code === 'ENOENT') res.status(404).json({ error: 'Artwork not found.' }); else next(error); } });
    } catch (error) { next(error); }
  });
}
module.exports = { decodeArtwork, saveArtwork, registerArtwork };
