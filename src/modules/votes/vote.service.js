const voteRepository = require('./vote.repository');
const db = require('../../models');

const VOTE_MAP = {
    upvote: 1,
    downvote: -1
};

class VoteService {
    async toggleVote(userId, postId, type) {
        const voteValue = VOTE_MAP[type];

        // 1. Tìm vote đã tồn tại
        const existingVote = await voteRepository.findVote(userId, postId);

        if (existingVote) {
            if (existingVote.vote_type === voteValue) {
                // Bấm lại cùng nút -> Hủy vote
                await voteRepository.delete(userId, postId);
            } else {
                // Đổi từ Up sang Down hoặc ngược lại
                await voteRepository.update(userId, postId, voteValue);
            }
        } else {

            await voteRepository.create({
                users_id: userId,
                post_id: postId,
                vote_type: voteValue
            });
        }

        return await voteRepository.countTotalScore(postId);
    }

    async cancelVote(userId, postId) {
        await voteRepository.delete(userId, postId);
        return await voteRepository.countTotalScore(postId);
    }

    async getVoteStats(postId) {

        const stats = await voteRepository.getDetailedStats(postId);

        return {
            upvotes: stats.upvotes,
            downvotes: stats.downvotes,
            totalScore: stats.upvotes - stats.downvotes
        };
    }
}

module.exports = new VoteService();