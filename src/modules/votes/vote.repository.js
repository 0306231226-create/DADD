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

<<<<<<< HEAD

=======
    // Tạo mới một lượt vote (lưu vào bảng votes)
>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
    async create(data) {
        return await db.Vote.create({
            user_id: data.users_id,
            post_id: data.post_id,
<<<<<<< HEAD
            vote_type: data.vote_type
=======
            vote_type: data.vote_type // 1 là up, -1 là down
>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
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
<<<<<<< HEAD
            force: true
=======
            force: true // Xóa sạch dấu vết, không dùng soft delete
>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
        });
    }

    // Đếm chi tiết có bao nhiêu lượt Up và bao nhiêu lượt Down
    async getDetailedStats(postId) {
<<<<<<< HEAD

        const upvotes = await db.Vote.count({
            where: {
                posts_id: postId,
                vote_type: 1
=======
        const upvotes = await db.Vote.count({
            where: { 
                post_id: postId, // Nếu lỗi thì kiểm tra lại tên cột trong DB là post_id hay posts_id
                vote_type: 1 
>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
            }
        });

        const downvotes = await db.Vote.count({
<<<<<<< HEAD
            where: {
                posts_id: postId,
                vote_type: -1
=======
            where: { 
                post_id: postId, 
                vote_type: -1 
>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
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