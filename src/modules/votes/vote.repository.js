const db = require('../../models');

class VoteRepository {
    // Tìm xem ông user này đã từng vote bài này chưa
    async findVote(userId, postId) {
        return await db.Vote.findOne({
            where: {
                user_id: userId,
                post_id: postId
            }
        });
    }


    async create(data) {
        return await db.Vote.create({
            user_id: data.users_id,
            post_id: data.post_id,
            vote_type: data.vote_type

        });
    }

    // Cập nhật lại loại vote (ví dụ từ đang up chuyển sang down)
    async update(userId, postId, voteValue) {
        return await db.Vote.update(
            { vote_type: voteValue },
            { where: { user_id: userId, post_id: postId } }
        );
    }

    // Xóa lượt vote khỏi database khi user bấm hủy
    async delete(userId, postId) {
        return await db.Vote.destroy({
            where: { user_id: userId, post_id: postId },

            force: true // Xóa sạch dấu vết, không dùng soft delete

        });
    }

    // Đếm chi tiết có bao nhiêu lượt Up và bao nhiêu lượt Down
    async getDetailedStats(postId) {



        const upvotes = await db.Vote.count({
            where: { 
                post_id: postId, // Nếu lỗi thì kiểm tra lại tên cột trong DB là post_id hay posts_id
                vote_type: 1 

            }
        });

        const downvotes = await db.Vote.count({

            where: { 
                post_id: postId, 
                vote_type: -1 

            }
        });

        return { upvotes, downvotes };
    }

    // Tính tổng điểm (Up cộng Down trừ) của bài viết
    async countTotalScore(postId) {
        const result = await db.Vote.sum('vote_type', {
            where: { post_id: postId }
        });
        return result || 0; // Trả về 0 nếu chưa có ai vote
    }
}

module.exports = new VoteRepository();