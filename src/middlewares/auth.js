const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function(roles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.sub).select('-passwordHash');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
