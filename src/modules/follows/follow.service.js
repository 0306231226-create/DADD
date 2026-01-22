const followRepository = require('./follow.repository');
const db = require('../../models');

class FollowService {
    // Hàm xử lý "2 trong 1": Nếu chưa follow thì tạo mới, nếu rồi thì xóa
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