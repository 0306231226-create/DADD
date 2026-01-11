const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Tất cả các route này đều cần đăng nhập (Bearer Token)
router.get('/me', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, userController.updateProfile);
router.put('/me/interests', authMiddleware, userController.updateMyInterests);

module.exports = router;