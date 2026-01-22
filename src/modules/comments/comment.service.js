const commentRepository = require('./comment.repository');
const db = require('../../models');

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
            comment: content, 
            parent_id: parentId
        });
    }
    async replyComment(userId, parentCommentId, contentValue) {
       
        const parentComment = await commentRepository.findById(parentCommentId);
        if (!parentComment) {
            throw new Error('Bình luận cha không tồn tại');
        }

       
        
        return await commentRepository.create({
            users_id: userId,
            posts_id: parentComment.posts_id,
            comment: contentValue, 
            parent_id: parentCommentId 
        });
    }
    async deleteComment(commentId, userId, userRole) {
        const comment = await commentRepository.findById(commentId);

        if (!comment) {
            throw new Error('Bình luận không tồn tại');
        }

        if (comment.users_id !== userId && userRole !== 'admin') {
            throw new Error('Bạn không có quyền xóa bình luận này');
        }

        return await commentRepository.softDelete(commentId);
    }
    async getCommentById(commentId) {

        return await db.Comment.findByPk(commentId);
    };
}

module.exports = new CommentService();