const voteRepository = require('./vote.repository');

class VoteService {
    async toggleVote(userId, postId, type) {
        const existingVote = await voteRepository.findVote(userId, postId);

        if (existingVote) {
            if (existingVote.vote_type === type) {
                // Người dùng bấm lại cùng một nút -> Hủy vote
                await voteRepository.delete(userId, postId);
            } else {
                // Người dùng đổi từ Up sang Down hoặc ngược lại
                await voteRepository.update(userId, postId, type);
            }
        } else {
            // Chưa từng vote bài này -> Tạo mới
            await voteRepository.create({ users_id: userId, posts_id: postId, vote_type: type });
        }

        return await voteRepository.countTotalScore(postId);
    }
    // src/modules/votes/vote.service.js

async cancelVote(userId, postId) {
    // 1. Thực hiện xóa vote
    await voteRepository.deleteVote(userId, postId);

    // 2. Tính toán lại tổng điểm vote mới nhất của bài viết
    return await voteRepository.countTotalScore(postId);
}
}

module.exports = new VoteService();