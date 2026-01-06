const express = require('express')
const router = express.Router()

// Đăng bài viết
router.post('/', (req, res) => {
  res.json({ message: 'Create post' })
})

// Lấy bài viết trang chủ
router.get('/', (req, res) => {
  res.json({ message: 'Get posts home' })
})

// Lấy bài viết theo user
router.get('/user/:userId', (req, res) => {
  res.json({ message: 'Get posts by user' })
})

// Cập nhật bài viết
router.put('/:postId', (req, res) => {
  res.json({ message: 'Update post' })
})

// Chia sẻ bài viết
router.post('/:postId/share', (req, res) => {
  res.json({ message: 'Share post' })
})

module.exports = router
