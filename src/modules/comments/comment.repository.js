const { Comment, User } = require('../../models');
const db = require('../../models');

class CommentRepository {
    // 1. Lấy tất cả bình luận của một bài viết kèm thông tin User
    async findAllByPostId(posts_id) {
        return await Comment.findAll({
            where: { posts_id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'avatarurl']
            }],
            order: [['created_at', 'ASC']]
        });
    }

    // 2. Tạo bình luận mới và lấy kèm thông tin User để trả về
    async create(data) {
        const newComment = await Comment.create(data);
        // Lấy lại comment vừa tạo kèm thông tin User để trả về Client
        return await Comment.findByPk(newComment.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'avatarurl']
            }]
        });
    }

    // 3. Tìm bình luận theo ID (Sử dụng trực tiếp db.Comment)
    async findById(id) {
        return await db.Comment.findByPk(id);
    }

    // 4. Tạo bình luận mới (Hàm trùng tên thứ 2 trong file của bạn)
    async create(data) {
        const newComment = await db.Comment.create(data);
        return await db.Comment.findByPk(newComment.id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username', 'avatarurl']
            }]
        });
    }

    // 5. Tìm bình luận theo ID (Hàm trùng tên thứ 2 trong file của bạn)
    async findById(id) {
        return await db.Comment.findByPk(id);
    }

    // 6. Xóa bình luận khỏi database
    async softDelete(commentId) {
        return await db.Comment.destroy({
            where: { id: commentId }
        });
    }
}

module.exports = new CommentRepository();