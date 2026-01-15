// src/modules/notifications/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Lấy danh sách thông báo cá nhân, cần login mới lấy được
router.get('/', authMiddleware, notificationController.getMyNotifications);

// Đánh dấu một thông báo là đã đọc (dùng PATCH để cập nhật một phần dữ liệu)
router.patch('/:id/read', authMiddleware, notificationController.markRead);

module.exports = router;