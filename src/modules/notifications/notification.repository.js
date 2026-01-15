// src/modules/notifications/notification.repository.js
const db = require('../../models');

class NotificationRepository {
    // Lấy danh sách thông báo của user, ưu tiên cái mới nhất hiện lên trước
    async getAllByUser(userId, limit = 20) {
        return await db.Notification.findAll({
            where: { users_id: userId },
            order: [['created_at', 'DESC']],
            limit: limit
        });
    }

    // Cập nhật trạng thái thông báo thành 'đã xem' dựa trên ID
    async markAsRead(notificationId, userId) {
        return await db.Notification.update(
            { is_seen: true }, // Đánh dấu đã đọc
            { where: { id: notificationId, users_id: userId } }
        );
    }
}

module.exports = new NotificationRepository();