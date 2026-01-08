const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
