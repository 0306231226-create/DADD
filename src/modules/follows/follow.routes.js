const express = require('express');
const router = express.Router();
const followController = require('./follow.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Route xử lý Follow/Unfollow: /api/follows/:userId
router.post('/:userId', authMiddleware, followController.followUser);

module.exports = router;