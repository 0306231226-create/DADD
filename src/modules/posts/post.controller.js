const postService = require('./post.service');
const db = require('../../models');

class PostController {
    // API Lấy danh sách bài viết của chính người đang đăng nhập
   async getPostsByUser(req, res) {
    try {
        const { userId } = req.params;
        // Mặc định mỗi lần cuộn lấy 10 bài
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        const data = await postService.getUserPosts(userId, page, limit);
        
        return res.json({ 
            status: 'success', 
            data: data 
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
// src/modules/users/user.controller.js
async getProfile(req, res) {
    try {
        const user = await db.User.findByPk(req.user.id, {
            include: [{
                model: db.Tag,
                as: 'userTags',
                attributes: ['id', 'tags_name'], // Chỉ lấy id và tên tag
                through: { attributes: [] } // Bỏ qua các cột của bảng trung gian
            }]
        });

        return res.json({ status: 'success', data: user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

    // API Đăng bài viết
    async createPost(req, res) {
        try {
            const userId = req.user.id;
            if (!req.body.content) {
                return res.status(400).json({ message: 'Nội dung bài viết không được để trống' });
            }
            const post = await postService.createPost(userId, req.body);
            return res.status(201).json({ status: 'success', data: post });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getNewsfeed(req, res) {
    try {
        // req.user có thể undefined nếu không yêu cầu token bắt buộc
        const data = await postService.getNewsfeed(req.user, req.query);
        
        return res.json({
            status: 'success',
            data: data
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
async updatePost(req, res) {
    try {
        // SỬA Ở ĐÂY: Lấy đúng postId từ params
        const { postId } = req.params; 
        const { title, content, tags } = req.body;
        const userId = req.user.id;

        // Ép kiểu về Number để đảm bảo so sánh chính xác
        const post = await db.Post.findOne({ 
            where: { 
                id: Number(postId), 
                users_id: Number(userId) 
            } 
        });

        if (!post) {
            return res.status(404).json({ 
                status: 'error',
                message: "Không tìm thấy bài viết hoặc bạn không có quyền chỉnh sửa" 
            });
        }
        
        // Cập nhật thông tin bài viết
        await post.update({ title, content });

        // Xử lý Tags (Phần này giữ nguyên như cũ)
       if (tags && Array.isArray(tags)) {
    const tagObjects = await db.Tag.findAll({
        attributes: ['id', 'tags_name'],
        where: { tags_name: tags }
    });

    if (tagObjects.length > 0) {
        // 1. Xóa dùng đúng tên cột posts_id
        await db.PostTag.destroy({ 
            where: { posts_id: postId } 
        });

        // 2. Tạo data dùng đúng tên cột posts_id và tags_id
        const postTagData = tagObjects.map(t => ({
            posts_id: postId,
            tags_id: t.id
        }));
        
        await db.PostTag.bulkCreate(postTagData);
    }
}
        return res.json({
            status: 'success',
            message: 'Cập nhật bài viết và tags thành công'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
async sharePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            const shared = await postService.sharePost(userId, postId);

            return res.status(201).json({
                status: 'success',
                message: 'Đã ghi nhận lượt chia sẻ bài viết',
                data: shared
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new PostController();