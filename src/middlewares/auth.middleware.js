const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Bạn cần đăng nhập' });
        }
        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        req.user = decoded; 
        next();
    } catch (error) {
        
        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};