const express = require('express')
const router = express.Router()

// Vote bài viết
router.post('/', (req, res) => {
  res.json({ message: 'Vote post' })
})

// Hủy vote
router.delete('/:postId', (req, res) => {
  res.json({ message: 'Unvote post' })
})

module.exports = router
