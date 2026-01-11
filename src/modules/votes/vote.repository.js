const db = require('../../models');

class VoteRepository {
    async findVote(userId, postId) {
        return await db.Vote.findOne({
            where: { 
                user_id: userId, 
                post_id: postId 
            }
        });
    }

    // src/modules/votes/vote.repository.js
// Bản Repository rút gọn chuẩn cho Model của bạn
async create(data) {
    return await db.Vote.create({
        user_id: data.users_id,
        post_id: data.post_id,
        vote_type: data.vote_type
    });
}

    async update(userId, postId, voteValue) {
        return await db.Vote.update(
            { vote_type: voteValue },
            { where: { user_id: userId, post_id: postId } }
        );
    }

    async delete(userId, postId) {
        return await db.Vote.destroy({
            where: { user_id: userId, post_id: postId },
            force: true // Xóa hẳn bản ghi
        });
    }

    async countTotalScore(postId) {
        const upvotes = await db.Vote.count({ where: { post_id: postId, vote_type: 1 } });
        const downvotes = await db.Vote.count({ where: { post_id: postId, vote_type: -1 } });
        return upvotes - downvotes;
    }
}

module.exports = new VoteRepository();