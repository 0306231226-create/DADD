const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const postController = require('./post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadCloud = require('../../config/cloudinary');


// Cập nhật bài viết, có cho upload đè ảnh mới lên Cloudinary
router.put('/:postId', authMiddleware, uploadCloud.single('image'), postController.updatePost);

// Tạo bài viết mới kèm upload ảnh
router.post('/create', authMiddleware, uploadCloud.single('image'), postController.createPost);

// Route để share bài viết của người khác
router.post('/:postId/share', authMiddleware, postController.sharePost);

// Tìm kiếm hoặc lọc bài viết theo mấy cái tag
router.get('/filter', postController.filterByTag);

router.get('/tag/:tagId', postController.getPostsByTag);

router.get('/user/:userId', postController.getPostsByUser);

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

router.get('/', optionalAuth, postController.getNewsfeed);

module.exports = router;




/**
 * @swagger
 * tags:
 * name: Posts
 * description: Quản lý bài viết và Phân trang
 */

/**
 * @swagger
 * /api/posts/user/{userId}/posts:
 * get:
 * summary: Lấy danh sách bài viết của một User (Có phân trang)
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: integer
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * description: Số trang hiện tại
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * default: 10
 * description: Số bài viết mỗi trang
 * responses:
 * 200:
 * description: Trả về mảng posts, hasMore và nextPage
 */

/**
 * @swagger
 * /api/posts/tag/{tagId}:
 * get:
 * summary: Lấy bài viết theo Tag (Có phân trang)
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: tagId
 * required: true
 * schema:
 * type: integer
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * responses:
 * 200:
 * description: Danh sách bài viết có chứa tag này
 */