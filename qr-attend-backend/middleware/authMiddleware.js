import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '🔐 Unauthorized: Token missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Decode token and attach user data to req
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ message: '❌ Forbidden: Invalid or expired token' });
  }
};
