const commentRepository = require('./comment.repository');
const db = require('../../models');

class CommentService {
    // 1. Lấy và cấu trúc lại bình luận theo dạng cây (Tree Structure)
    async getCommentsByPost(postId) {
        const allComments = await commentRepository.findAllByPostId(postId);
        
        const commentMap = {};
        const roots = [];

        // Tạo một bản đồ (Map) để truy xuất nhanh từng comment qua ID
        allComments.forEach(c => {
            const node = c.toJSON();
            node.replies = []; // Khởi tạo mảng chứa các câu trả lời
            commentMap[node.id] = node;
        });

        // Duyệt lần 2 để đưa các comment con vào đúng comment cha của nó
        allComments.forEach(c => {
            const node = commentMap[c.id];
            // Nếu có parent (bình luận con)
            if (node.parent) {
                if (commentMap[node.parent]) {
                    commentMap[node.parent].replies.push(node);
                }
            } else {
                // Nếu không có parent thì đây là bình luận gốc (level 0)
                roots.push(node);
            }
        });

        return roots;
    }

    // 2. Logic tạo bình luận mới (kiểm tra nội dung trống)
    async createComment(userId, postId, content, parentId = null) {
        if (!content || content.trim() === '') {
            throw new Error('Nội dung bình luận không được để trống');
        }

        return await commentRepository.create({
            users_id: userId,
            posts_id: postId,
            comment: content, // Tương ứng với cột trong DB
            parent_id: parentId
        });
    }

    // 3. Logic trả lời (Reply) một bình luận khác
    async replyComment(userId, parentCommentId, contentValue) {
        // Kiểm tra xem cái comment mình định reply nó còn tồn tại không
        const parentComment = await commentRepository.findById(parentCommentId);
        if (!parentComment) {
            throw new Error('Bình luận cha không tồn tại');
        }

        // Tạo reply và kế thừa posts_id từ comment cha
        return await commentRepository.create({
            users_id: userId,
            posts_id: parentComment.posts_id,
            comment: contentValue,
            parent_id: parentCommentId 
        });
    }

    // 4. Logic xóa bình luận kèm kiểm tra quyền hạn (Ownership & Role)
    async deleteComment(commentId, userId, userRole) {
        const comment = await commentRepository.findById(commentId);
        
        if (!comment) {
            throw new Error('Bình luận không tồn tại');
        }

        // Quyền xóa: Phải là người tạo ra comment đó HOẶC là Admin hệ thống
        if (comment.users_id !== userId && userRole !== 'admin') {
            throw new Error('Bạn không có quyền xóa bình luận này');
        }

        return await commentRepository.softDelete(commentId);
    }

    // 5. Lấy thông tin thô của 1 bình luận qua Primary Key
    async getCommentById(commentId) {
        return await db.Comment.findByPk(commentId); 
    };
}

module.exports = new CommentService();