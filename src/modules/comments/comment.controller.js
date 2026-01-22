const commentService = require('./comment.service');

class CommentController {
    // Lấy toàn bộ bình luận của một bài viết
    async getComments(req, res) {
        try {
            const { postId } = req.params;
            const comments = await commentService.getCommentsByPost(postId);

            return res.json({
                status: 'success',
                data: comments
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Tạo bình luận mới (Có thể là cmt gốc hoặc cmt cấp 2 nếu có parent_id)
    async createComment(req, res) {
        try {
            const { postId } = req.params;
            const { content, parent_id } = req.body;
            const userId = req.user.id; 
<<<<<<< HEAD
=======

>>>>>>> 1e5e2ce1a907a32510a080997fd9e87b4a11ffb8
            const newComment = await commentService.createComment(
                userId, 
                postId, 
                content, 
                parent_id
            );

            return res.status(201).json({
                status: 'success',
                message: 'Đã đăng bình luận',
                data: newComment
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    // Trả lời trực tiếp vào một bình luận khác (Reply)
    async replyComment(req, res) {
        try {
            const { commentId } = req.params; 
            const { content } = req.body;
            const userId = req.user.id;

            const reply = await commentService.replyComment(userId, commentId, content);

            return res.status(201).json({
                status: 'success',
                message: 'Đã trả lời bình luận',
                data: reply
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    // Xóa bình luận (Kiểm tra xem có phải chủ nhân hoặc Admin không)
    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role; 

            await commentService.deleteComment(commentId, userId, userRole);

            return res.json({
                status: 'success',
                message: 'Đã xóa bình luận thành công'
            });
        } catch (error) {
            const statusCode = error.message.includes('quyền') ? 403 : 404;
            return res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

    // Lấy chi tiết một bình luận duy nhất
    async getOneComment(req, res) {
        try {
            const { commentId } = req.params;
            const comment = await commentService.getCommentById(commentId);
            
            if (!comment) {
                return res.status(404).json({ message: 'Không tìm thấy bình luận' });
            }

            return res.status(200).json(comment);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CommentController();