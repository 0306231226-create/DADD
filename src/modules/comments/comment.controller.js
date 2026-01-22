const commentService = require('./comment.service');

class CommentController {
    
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

    async createComment(req, res) {
        try {
            const { postId } = req.params;
            const { content, parent_id } = req.body;
            const userId = req.user.id; 
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