const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const JWT_TOKEN = process.env.JWT_TOKENKEY;
    const decoded = jwt.verify(token, JWT_TOKEN);

    req.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).send('Invalid token.');
  }
  return next();
};

module.exports = { auth };
