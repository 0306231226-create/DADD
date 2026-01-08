// src/modules/notifications/notification.service.js
const notificationRepository = require('./notification.repository');

class NotificationService {
    async getNotifications(userId) {
        return await notificationRepository.getAllByUser(userId);
    }

    async readNotification(notificationId, userId) {
        return await notificationRepository.markAsRead(notificationId, userId);
    }
}

module.exports = new NotificationService();