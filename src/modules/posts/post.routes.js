const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const postController = require('./post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Các route này bắt buộc phải gửi kèm Access Token
router.get('/user/:userId/posts', authMiddleware, postController.getPostsByUser);
// Route cập nhật bài viết (Yêu cầu đăng nhập)
router.put('/:postId', authMiddleware, postController.updatePost);
router.post('/create', authMiddleware, postController.createPost);
router.post('/:postId/share', authMiddleware, postController.sharePost);
const voteController = require('../votes/vote.controller');

// Thêm route này vào dưới các route của post
router.post('/:postId/vote', authMiddleware, voteController.votePost);
// Một middleware nhẹ để lấy thông tin user nếu có token, nhưng không báo lỗi 401 nếu thiếu
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return next();

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};

// Route trong post.routes.js
router.get('/', optionalAuth, postController.getNewsfeed);

module.exports = router;
