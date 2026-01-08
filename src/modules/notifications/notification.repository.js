// src/modules/notifications/notification.repository.js
const db = require('../../models');

class NotificationRepository {
    async getAllByUser(userId, limit = 20) {
        return await db.Notification.findAll({
            where: { users_id: userId },
            order: [['created_at', 'DESC']],
            limit: limit
        });
    }

    async markAsRead(notificationId, userId) {
        return await db.Notification.update(
            { is_seen: true },
            { where: { id: notificationId, users_id: userId } }
        );
    }
}

module.exports = new NotificationRepository();