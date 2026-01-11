const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commentController = require('./comment.controller');

// --- NHÓM 1: Đi kèm với tiền tố /api/posts ---

// GET /api/posts/:postId/comments
router.get('/:postId/comments', commentController.getComments); 

// POST /api/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, commentController.createComment);


// --- NHÓM 2: Đi kèm với tiền tố /api/comments ---

// DELETE /api/comments/:commentId
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

// POST /api/comments/:commentId/reply
router.post('/:commentId/reply', authMiddleware, commentController.replyComment);

// GET /api/comments/:commentId (Lấy 1 comment cụ thể như bạn muốn lúc nãy)
router.get('/:commentId', commentController.getOneComment);

module.exports = router;