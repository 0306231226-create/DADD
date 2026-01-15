const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadCloud = require('../../config/cloudinary');


// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, userController.getProfile);

// Cập nhật thông tin user
router.put('/update', authMiddleware, uploadCloud.single('avatar'), userController.updateProfile);

// Cập nhật sở thích của user hiện tại
router.put('/me/interests', authMiddleware, userController.updateInterests);
module.exports = router;
