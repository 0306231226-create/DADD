const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Tất cả các route này đều cần đăng nhập (Bearer Token)

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, userController.getProfile);

// Cập nhật thông tin user
router.put('/update', authMiddleware, userController.updateProfile);

// Cập nhật sở thích của user hiện tại
router.put('/me/interests', authMiddleware, userController.updateInterests);
module.exports = router;
