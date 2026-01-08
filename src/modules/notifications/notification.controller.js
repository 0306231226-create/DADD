// src/modules/notifications/notification.controller.js
const notificationService = require('./notification.service');

class NotificationController {
    // GET /api/notifications
    async getMyNotifications(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await notificationService.getNotifications(userId);
            return res.json({ status: 'success', data: notifications });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // PATCH /api/notifications/:id/read
    async markRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await notificationService.readNotification(id, userId);
            return res.json({ status: 'success', message: 'Đã đánh dấu đã đọc' });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getMyNotifications(req, res) {
        try {
            const userId = req.user.id;
            const data = await notificationService.getNotifications(userId);
            return res.json({ status: 'success', data });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new NotificationController();