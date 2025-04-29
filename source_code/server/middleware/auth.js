import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.header('Authorization') || '';
  if (!header.startsWith('Bearer ')) return res.status(401).send('No token.');
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userId = payload._id;
    next();
  } catch {
    res.status(401).send('Invalid or expired token.');
  }
}