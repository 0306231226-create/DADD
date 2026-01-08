// src/modules/notifications/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware, notificationController.getMyNotifications);
router.patch('/:id/read', authMiddleware, notificationController.markRead);

module.exports = router;