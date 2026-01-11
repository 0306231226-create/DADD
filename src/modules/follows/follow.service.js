const followRepository = require('./follow.repository');
const db = require('../../models');

class FollowService {
    async toggleFollow(followerId, followingId) {
        if (followerId === parseInt(followingId)) {
            throw new Error('Bạn không thể theo dõi chính mình');
        }

        const existingFollow = await followRepository.findFollow(followerId, followingId);

        if (existingFollow) {
            await followRepository.deleteFollow(followerId, followingId);
            return { action: 'unfollow' };
        } else {
            await followRepository.createFollow(followerId, followingId);
            
            // TẠO THÔNG BÁO (Flow kết nối sang bảng notifications)
            await db.Notification.create({
                users_id: followingId,
                title: 'Người theo dõi mới',
                content: `Ai đó đã bắt đầu theo dõi bạn`,
                is_seen: false
            });

            return { action: 'follow' };
        }
    }
}

module.exports = new FollowService();