const express = require('express')
const router = express.Router()

// Lấy thông tin user
router.get('/me', (req, res) => {
  res.json({ message: 'Get user info' })
})

// Cập nhật thông tin user
router.put('/me', (req, res) => {
  res.json({ message: 'Update user info' })
})

// Cập nhật sở thích
router.put('/interests', (req, res) => {
  res.json({ message: 'Update interests' })
})

module.exports = router
