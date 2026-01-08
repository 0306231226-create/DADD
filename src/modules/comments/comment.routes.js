const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware');
const commentController = require('./comment.controller');

// GET /api/posts/1/comments
router.get('/:postId/comments', commentController.getComments); 
router.post('/:postId/comments', authMiddleware, commentController.createComment);
router.post('/comments/:commentId/reply', authMiddleware, commentController.replyComment);
router.delete('/comments/:commentId', authMiddleware, commentController.deleteComment);
// Lấy danh sách comment
router.get('/post/:postId', (req, res) => {
  res.json({ message: 'Get comments' })
})

// Comment bài viết
router.post('/', (req, res) => {
  res.json({ message: 'Create comment' })
})

// Trả lời comment
router.post('/:commentId/reply', (req, res) => {
  res.json({ message: 'Reply comment' })
})

// Xóa comment
router.delete('/:commentId', (req, res) => {
  res.json({ message: 'Delete comment' })
})

module.exports = router
