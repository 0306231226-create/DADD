// src/modules/notifications/notification.controller.js
const notificationService = require('./notification.service');

class NotificationController {
    // Lấy tất cả thông báo của người dùng đang đăng nhập
    async getMyNotifications(req, res) {
        try {
            const userId = req.user.id;
            // Gọi service để lấy list thông báo từ DB
            const data = await notificationService.getNotifications(userId);
            
            return res.json({ 
                status: 'success', 
                data: data 
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Xử lý khi user bấm vào thông báo để đánh dấu là đã đọc
    async markRead(req, res) {
        try {
            const { id } = req.params; // ID của thông báo cần update
            const userId = req.user.id;
            
            // Chuyển trạng thái thông báo sang 'read'
            await notificationService.readNotification(id, userId);
            
            return res.json({ 
                status: 'success', 
                message: 'Đã đánh dấu đã đọc' 
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new NotificationController();