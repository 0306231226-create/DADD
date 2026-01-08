const { Post, User } = require('../../models');
const { Op } = require('sequelize');

class PostRepository {
    // --- MỚI: Thêm hàm findById để fix lỗi ---
    async findById(id) {
        return await Post.findByPk(id, {
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['id', 'username', 'avatarurl'] 
            }]
        });
    }

    // 1. Lấy tất cả bài viết theo User ID (Không phân trang)
    async findAllByUserId(users_id) {
        return await Post.findAll({
            where: { users_id },
            order: [['id', 'DESC']],
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['username', 'avatarurl'] 
            }]
        });
    }

    // 2. Tạo bài viết mới
    async create(postData) {
        return await Post.create(postData);
    }

    // 3. Lấy bài viết cho Newsfeed (Có phân trang và lọc theo sở thích)
    async findAllForNewsfeed({ limit, offset, interests = [], sortBy = 'id', order = 'DESC' }) {
        let whereCondition = { status: 'public' };

        if (interests.length > 0) {
            whereCondition[Op.or] = interests.map(tag => ({
                [Op.or]: [
                    { title: { [Op.like]: `%${tag}%` } },
                    { content: { [Op.like]: `%${tag}%` } }
                ]
            }));
        }

        return await Post.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order]],
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['username', 'avatarurl'] 
            }]
        });
    }

    // 4. Lấy bài viết theo User ID (Có phân trang để scroll)
    async findByUserIdForScroll(users_id, limit, offset) {
        return await Post.findAll({
            where: { users_id },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'DESC']],
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['username', 'avatarurl'] 
            }]
        });
    }

    // 5. Cập nhật bài viết
    async update(id, updateData) {
        await Post.update(updateData, {
            where: { id }
        });
        // Gọi hàm findById vừa thêm ở trên
        return await this.findById(id); 
    }
    async incrementShareCount(postId) {
        return await db.Post.increment('share_count', {
            where: { id: postId }
        });
    }
    async createShare(userId, postId) {
        // Tạo một dòng mới trong bảng share_posts
        return await db.SharePost.create({
            users_id: userId,
            posts_id: postId
        });
    }
}

module.exports = new PostRepository();