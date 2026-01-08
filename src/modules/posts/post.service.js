const postRepository = require('./post.repository');

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
}


module.exports = new PostService();