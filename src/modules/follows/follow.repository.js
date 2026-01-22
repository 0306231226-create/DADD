const db = require('../../models');

class FollowRepository {
 
    async findFollow(followerId, followingId) {
        return await db.Follow.findOne({
            where: { follower_id: followerId, following_id: followingId }
        });
    }

    async createFollow(followerId, followingId) {
        return await db.Follow.create({
            follower_id: followerId,
            following_id: followingId
        });
    }


    async deleteFollow(followerId, followingId) {
        return await db.Follow.destroy({
            where: { follower_id: followerId, following_id: followingId }
        });
    }
}

module.exports = new FollowRepository();