const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Các route này bắt buộc phải gửi kèm Access Token
router.get('/user/:userId/posts', authMiddleware, postController.getPostsByUser);
router.post('/create', authMiddleware, postController.createPost);

module.exports = router;
