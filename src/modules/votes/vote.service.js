const voteRepository = require('./vote.repository');
const db = require('../../models');

// Quy định giá trị: Up thì cộng 1, Down thì trừ 1
const VOTE_MAP = {
    upvote: 1,
    downvote: -1
};

class VoteService {
    // Hàm xử lý logic thông minh: Tự động tạo mới, đổi loại hoặc hủy vote
    async toggleVote(userId, postId, type) {
        const voteValue = VOTE_MAP[type];

        const existingVote = await voteRepository.findVote(userId, postId);

        if (existingVote) {
            if (existingVote.vote_type === voteValue) {
                // Nếu bấm lại đúng cái nút cũ (đang up lại bấm up) -> Hủy luôn lượt vote đó
                await voteRepository.delete(userId, postId);
            } else {
                // Nếu bấm nút ngược lại (đang up chuyển sang down) -> Cập nhật lại giá trị
                await voteRepository.update(userId, postId, voteValue);
            }
        } else {

            await voteRepository.create({
                users_id: userId,
                post_id: postId,
                vote_type: voteValue
            });
        }

        // Xử lý xong thì tính lại tổng điểm mới nhất để trả về cho Client hiển thị
        return await voteRepository.countTotalScore(postId);
    }

    // Hàm dùng riêng cho việc hủy vote (xóa hẳn bản ghi)
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