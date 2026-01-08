const commentRepository = require('./comment.repository');

class CommentService {
    async getCommentsByPost(postId) {
        const allComments = await commentRepository.findAllByPostId(postId);
        
        const commentMap = {};
        const roots = [];

        allComments.forEach(c => {
            const node = c.toJSON();
            node.replies = [];
            commentMap[node.id] = node;
        });

        allComments.forEach(c => {
            const node = commentMap[c.id];
            // Kiểm tra cột 'parent' theo đúng cấu trúc DB của bạn
            if (node.parent) {
                if (commentMap[node.parent]) {
                    commentMap[node.parent].replies.push(node);
                }
            } else {
                roots.push(node);
            }
        });

        return roots;
    }
    async createComment(userId, postId, content, parentId = null) {
        if (!content || content.trim() === '') {
            throw new Error('Nội dung bình luận không được để trống');
        }

        return await commentRepository.create({
            users_id: userId,
            posts_id: postId,
            comment: content, // Đảm bảo cột này đã được sửa thành 'content' trong DB
            parent_id: parentId
        });
    }
    async replyComment(userId, parentCommentId, contentValue) {
        // 1. Kiểm tra comment cha có tồn tại không
        const parentComment = await commentRepository.findById(parentCommentId);
        if (!parentComment) {
            throw new Error('Bình luận cha không tồn tại');
        }

        // 2. Tạo comment con (reply)
        // Lưu ý: posts_id của con phải giống posts_id của cha
        return await commentRepository.create({
            users_id: userId,
            posts_id: parentComment.posts_id,
            comment: contentValue, // Tên cột trong DB là 'comment'
            parent_id: parentCommentId // Cột thực tế trong DB là 'parent' (đã map trong Model)
        });
    }
    async deleteComment(commentId, userId, userRole) {
        const comment = await commentRepository.findById(commentId);
        
        if (!comment) {
            throw new Error('Bình luận không tồn tại');
        }

        // Kiểm tra quyền: Phải là chủ comment (users_id) hoặc là Admin
        if (comment.users_id !== userId && userRole !== 'admin') {
            throw new Error('Bạn không có quyền xóa bình luận này');
        }

        return await commentRepository.softDelete(commentId);
    }
}

module.exports = new CommentService();