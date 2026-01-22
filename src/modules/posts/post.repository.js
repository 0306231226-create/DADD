const { Post, User } = require('../../models');
const { Op } = require('sequelize');

class PostRepository {

    async findById(id) {
        return await Post.findByPk(id, {
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['id', 'username', 'avatarurl'] 
            }]
        });
    }


    async findByUserIdForScroll(userId, limit, offset) {
    return await Post.findAll({
        where: { 
            users_id: userId 
        },
        include: [
            {
                model: User,
                as: 'user', 
                attributes: ['id', 'username', 'avatarurl']
            }
        ],
        limit: limit,
        offset: offset, 
        order: [['id', 'DESC']] 
    });}


    async create(postData) {
        return await Post.create(postData);
    }

    // Lấy bài cho Newsfeed, có xử lý lọc theo sở thích nếu có truyền vào
    async findAllForNewsfeed({ limit, offset, interests = [], sortBy = 'id', order = 'DESC' }) {

        let whereCondition = { status: 'public' };

        // Nếu có sở thích thì tìm các bài có tiêu đề hoặc nội dung chứa từ khóa đó
        if (interests.length > 0) {
            whereCondition[Op.or] = interests.map(tag => ({
                [Op.or]: [
                    { title: { [Op.like]: `%${tag}%` } },
                    { content: { [Op.like]: `%${tag}%` } }
                ]
            }));
        }

        // Trả về cả danh sách bài và tổng số lượng bài để làm phân trang
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

    // Lấy bài viết của user theo kiểu phân đoạn để load dần khi cuộn trang
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

    // Cập nhật thông tin bài viết và trả về dữ liệu mới nhất sau khi sửa
    async update(id, updateData) {
        await Post.update(updateData, {
            where: { id }
        });
        return await this.findById(id); 
    }

    // Tăng số lượng lượt share trong bảng bài viết lên 1 đơn vị
    async incrementShareCount(postId) {
        return await db.Post.increment('share_count', {
            where: { id: postId }
        });
    }

    // Tạo bản ghi mới ghi nhận ông nào vừa share bài nào
    async createShare(userId, postId) {
        return await db.SharePost.create({
            users_id: userId,
            posts_id: postId
        });
    }
    // Thêm vào class PostRepository trong file post.repository.js
// post.repository.js
async findByTagIdForScroll(tagId, limit, offset) {
    const { Tag, User } = require('../../models');
    return await Post.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'DESC']],
        include: [
            {
                model: Tag,
                as: 'tags', // Phải khớp với 'as' bạn đặt ở index.js
                where: { id: tagId },
                through: { attributes: [] }
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatarurl']
            }
        ],
        distinct: true // Bắt buộc có để đếm đúng số lượng bài viết khi JOIN
    });
}
async findByUserIdForScroll(users_id, limit, offset) {
    return await Post.findAll({
        where: { users_id }, 
        limit: parseInt(limit),
        offset: parseInt(offset), 
        order: [['id', 'DESC']], 
        include: [{ 
            model: User, 
            as: 'user', 
            attributes: ['id', 'username', 'avatarurl'] 
        }]
    });
}
}

module.exports = new PostRepository();