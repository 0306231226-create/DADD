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
}

module.exports = new PostController();