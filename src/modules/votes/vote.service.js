const voteRepository = require('./vote.repository');
const db = require('../../models');

const VOTE_MAP = {
    upvote: 1,
    downvote: -1
};

class VoteService {
    async toggleVote(userId, postId, type) {
        const voteValue = VOTE_MAP[type];
        if (!voteValue) {
            throw new Error('Invalid vote type');
        }

        const existingVote = await voteRepository.findVote(userId, postId);

        if (existingVote) {
            if (existingVote.vote_type === voteValue) {
                // Bấm lại cùng nút → hủy vote
                await voteRepository.delete(userId, postId);
            } else {
                // Đổi up ↔ down
                await voteRepository.update(userId, postId, voteValue);
            }
        } else {
            // Tạo vote mới
            await voteRepository.create({
                users_id: userId,
                posts_id: postId,
                vote_type: voteValue
            });
        }

        return await voteRepository.countTotalScore(postId);
    }

    async cancelVote(userId, postId) {
        await voteRepository.deleteVote(userId, postId);
        return await voteRepository.countTotalScore(postId);
    }

    async getVoteStats(postId, userId) {
        const upvotes = await db.Vote.count({
            where: { post_id: postId, vote_type: 1 }
        });

        const downvotes = await db.Vote.count({
            where: { post_id: postId, vote_type: -1 }
        });

        const userVote = await db.Vote.findOne({
            where: { post_id: postId, user_id: userId }
        });

        return {
            postId,
            upvotes,
            downvotes,
            totalScore: upvotes - downvotes,
            currentUserVote: userVote ? userVote.vote_type : 0
        };
    }
}

module.exports = new VoteService();
