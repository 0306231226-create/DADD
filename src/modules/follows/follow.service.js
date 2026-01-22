const followRepository = require('./follow.repository');
const db = require('../../models');

class FollowService {
    // Hàm xử lý "2 trong 1": Nếu chưa follow thì tạo mới, nếu rồi thì xóa
    async toggleFollow(followerId, followingId) {
        // Chặn trường hợp dở khóc dở cười: Tự follow chính mình
        if (followerId === parseInt(followingId)) {
            throw new Error('Bạn không thể theo dõi chính mình');
        }

        // Kiểm tra xem trong DB đã có quan hệ này chưa
        const existingFollow = await followRepository.findFollow(followerId, followingId);

        if (existingFollow) {
            // Nếu có rồi thì thực hiện Unfollow
            await followRepository.deleteFollow(followerId, followingId);
            return { action: 'unfollow' };
        } else {
            // Nếu chưa có thì tạo mới quan hệ Follow
            await followRepository.createFollow(followerId, followingId);
            
            //Mỗi khi có người follow, gửi một thông báo vào bảng Notification
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