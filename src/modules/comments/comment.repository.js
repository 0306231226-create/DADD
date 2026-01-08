const { Comment, User } = require('../../models');
const db = require('../../models');
class CommentRepository {
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
    async findById(id) {
        return await db.Comment.findByPk(id);
    }

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
    async findById(id) {
        return await db.Comment.findByPk(id);
    }

    async softDelete(commentId) {
        return await db.Comment.destroy({
            where: { id: commentId }
        });
    }
}

module.exports = new CommentRepository();