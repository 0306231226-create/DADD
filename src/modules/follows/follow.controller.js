const followService = require('./follow.service');

class FollowController {
    // Xử lý việc theo dõi hoặc bỏ theo dõi một người dùng khác
    async followUser(req, res) {
        try {
            // ID của mình lấy từ Token giải mã
            const followerId = req.user.id;
            // ID của người mình định follow lấy từ URL
            const { userId: followingId } = req.params;

            // Gọi service xử lý logic đảo ngược trạng thái follow
            const result = await followService.toggleFollow(followerId, followingId);

            return res.json({
                status: 'success',
                message: result.action === 'follow' ? 'Đã theo dõi' : 'Đã hủy theo dõi',
                data: result
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new FollowController();