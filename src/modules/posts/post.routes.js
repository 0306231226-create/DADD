const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const postController = require('./post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadCloud = require('../../config/cloudinary');

// Lấy danh sách bài viết của một ông nào đó, cần login mới xem được
router.get('/user/:userId/posts', authMiddleware, postController.getPostsByUser);

// Cập nhật bài viết, có cho upload đè ảnh mới lên Cloudinary
router.put('/:postId', authMiddleware, uploadCloud.single('image'), postController.updatePost);

// Tạo bài viết mới kèm upload ảnh
router.post('/create', authMiddleware, uploadCloud.single('image'), postController.createPost);

// Route để share bài viết của người khác
router.post('/:postId/share', authMiddleware, postController.sharePost);

// Tìm kiếm hoặc lọc bài viết theo mấy cái tag
router.get('/filter', postController.filterByTag);

router.get('/tag/:tagId', postController.getPostsByTag);

router.get('/user/:userId/posts', postController.getPostsByUser);

const voteController = require('../votes/vote.controller');

// Vote bài viết, cái này cũng phải login mới cho làm
router.post('/:postId/vote', authMiddleware, voteController.votePost);

// Cái này để check xem có token không, có thì lấy info user còn không thì thôi, không bắt buộc login
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return next();

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};

// Trang chủ hiện bài viết, dùng cái optionalAuth ở trên để ưu tiên hiện bài theo sở thích nếu đã login
router.get('/', optionalAuth, postController.getNewsfeed);

module.exports = router;