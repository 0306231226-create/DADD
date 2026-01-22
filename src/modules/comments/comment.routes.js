const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const commentController = require('./comment.controller');



// GET /api/posts/:postId/comments
router.get('/:postId/comments', commentController.getComments); 

// POST /api/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, commentController.createComment);



// DELETE /api/comments/:commentId
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

// POST /api/comments/:commentId/reply
router.post('/:commentId/reply', authMiddleware, commentController.replyComment);

// GET /api/comments/:commentId 
router.get('/:commentId', commentController.getOneComment);

module.exports = router;