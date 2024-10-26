// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Same secret as above

const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded; // Attach the decoded user ID to the request
        next();
    });
};

module.exports = auth;
