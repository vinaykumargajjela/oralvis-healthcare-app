// authMiddleware.js in oralvis-backend
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds user payload (id, role) to request
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};