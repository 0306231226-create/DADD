// src/modules/notifications/notification.service.js
const notificationRepository = require('./notification.repository');

class NotificationService {
    // Lấy list thông báo đổ ra cho user xem
    async getNotifications(userId) {
        return await notificationRepository.getAllByUser(userId);
    }

    // Xử lý logic đánh dấu là đã đọc qua Repo
    async readNotification(notificationId, userId) {
        return await notificationRepository.markAsRead(notificationId, userId);
    }
}

module.exports = new NotificationService();