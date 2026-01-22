const db = require('../../models');

class FollowRepository {
    // Kiểm tra xem quan hệ follow này đã tồn tại trong DB chưa
    async findFollow(followerId, followingId) {
        return await db.Follow.findOne({
            where: { follower_id: followerId, following_id: followingId }
        });
    }

    // Tạo một bản ghi mới khi có người nhấn Follow
    async createFollow(followerId, followingId) {
        return await db.Follow.create({
            follower_id: followerId,
            following_id: followingId
        });
    }

    // Xóa bản ghi khỏi bảng Follow khi người dùng nhấn Unfollow
    async deleteFollow(followerId, followingId) {
        return await db.Follow.destroy({
            where: { follower_id: followerId, following_id: followingId }
        });
    }
}

module.exports = new FollowRepository();