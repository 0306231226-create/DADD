const postRepository = require('./post.repository');
const db = require('../../models');
class PostService {
    async getUserPosts(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    // Lấy dư ra 1 bản ghi để kiểm tra xem còn trang sau không
    const posts = await postRepository.findByUserIdForScroll(userId, limit + 1, offset);
    
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;

    return {
        posts: data,
        hasMore: hasMore,
        nextPage: hasMore ? parseInt(page) + 1 : null
    };
}

    async createPost(userId, postData) {
    const payload = {
        users_id: userId,
        title: postData.title, // <--- THÊM DÒNG NÀY
        content: postData.content,
        imageurl: postData.imageurl || null,
        status: 'public'
    };
    
    const newPost = await postRepository.create(payload);
    return await postRepository.findById(newPost.id);
}
async updatePost(postId, userId, updateData) {
    // 1. Tìm bài viết xem có tồn tại không
    const post = await postRepository.findById(postId);
    if (!post) {
        throw new Error('Bài viết không tồn tại');
    }

    // 2. Kiểm tra quyền sở hữu (userId từ Token vs users_id trong DB)
    if (post.users_id !== userId) {
        throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
    }

    // 3. Tiến hành cập nhật
    const updatedPost = await postRepository.update(postId, {
        title: updateData.title || post.title,
        content: updateData.content || post.content,
        imageurl: updateData.imageurl || post.imageurl,
        // Nếu bạn có dùng tags (lưu trong cột interests hoặc bảng riêng) thì thêm ở đây
    });

    return updatedPost;
}
async getNewsfeed(currentUser, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = query.sortBy || 'id';
    const order = query.order || 'DESC';

    // Nếu người dùng đã đăng nhập, lấy sở thích của họ ra để lọc
    const interests = (currentUser && currentUser.interests) ? currentUser.interests : [];

    const result = await postRepository.findAllForNewsfeed({
        limit,
        offset,
        interests,
        sortBy,
        order
    });

    return {
        posts: result.rows,
        totalItems: result.count,
        currentPage: page,
        hasMore: result.count > offset + result.rows.length
    };
}
async sharePost(userId, postId) {
        // 1. Kiểm tra bài viết tồn tại
        const post = await db.Post.findByPk(postId);
        if (!post) {
            throw new Error('Bài viết không tồn tại');
        }

        // 2. Ghi nhận hành động chia sẻ vào bảng share_posts
        return await db.SharePost.create({
            users_id: userId,
            posts_id: postId
        });
    }
}


module.exports = new PostService();