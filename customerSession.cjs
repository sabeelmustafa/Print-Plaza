const crypto = require('crypto');
const secret = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const cookieName = 'pp_customer_session';
const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' };

function sign(user, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ user, expires: now + 12 * 60 * 60 * 1000 })).toString('base64url');
  return `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
function verify(token, now = Date.now()) {
  try {
    if (typeof token !== 'string') return null;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest();
    const supplied = Buffer.from(signature, 'base64url');
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!Number.isFinite(data.expires) || data.expires <= now || typeof data.user?.email !== 'string' || !data.user?.uid) return null;
    return data.user;
  } catch { return null; }
}
module.exports = { sign, verify, cookieName, cookieOptions };
