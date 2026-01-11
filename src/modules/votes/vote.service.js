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
            // 2. Tạo vote mới - Chú ý tên trường phải khớp với Repository
            await voteRepository.create({
                users_id: userId,
                post_id: postId, // Đã sửa từ posts_id thành post_id
                vote_type: voteValue
            });
        }

        return await voteRepository.countTotalScore(postId);
    }

    async cancelVote(userId, postId) {
        await voteRepository.delete(userId, postId);
        return await voteRepository.countTotalScore(postId);
    }
}

module.exports = new VoteService();