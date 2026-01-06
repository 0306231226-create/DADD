const express = require('express')
const router = express.Router()

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
