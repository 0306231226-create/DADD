const postService = require('./post.service');

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
        const { postId } = req.params;
        const userId = req.user.id; // Lấy từ authMiddleware
        const updateData = req.body;

        const result = await postService.updatePost(postId, userId, updateData);

        return res.json({
            status: 'success',
            message: 'Cập nhật bài viết thành công',
            data: result
        });
    } catch (error) {
        // Trả về lỗi 403 nếu không có quyền, 404 nếu không thấy bài
        const statusCode = error.message.includes('quyền') ? 403 : 404;
        return res.status(statusCode).json({ 
            status: 'error', 
            message: error.message 
        });
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