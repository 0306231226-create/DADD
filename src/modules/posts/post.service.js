const postRepository = require('./post.repository');
const db = require('../../models');
const { Op } = require('sequelize');

class PostService {


    async getUserPosts(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        // Lấy thêm 1 bản ghi để check xem còn bài nào phía sau không
        const posts = await postRepository.findByUserIdForScroll(userId, limit + 1, offset);
        
        const hasMore = posts.length > limit;
        // Nếu lấy dư thì cắt bớt đi cho đúng limit
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

            title: postData.title,

     title: postData.title, 

            content: postData.content,
            image_url: postData.image_url || null,
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
            image_url: updateData.image_url || post.image_url,

        });

        return updatedPost;
    }
    // async getNewsfeed(currentUser, query) {
    //     const page = parseInt(query.page) || 1;
    //     const limit = parseInt(query.limit) || 10;
    //     const offset = (page - 1) * limit;
    //     const sortBy = query.sortBy || 'id';
    //     const order = query.order || 'DESC';


    //     const interests = (currentUser && currentUser.interests) ? currentUser.interests : [];

    //     const result = await postRepository.findAllForNewsfeed({
    //         limit,
    //         offset,
    //         interests,
    //         sortBy,
    //         order
    //     });

    //     return {
    //         posts: result.rows,
    //         totalItems: result.count,
    //         currentPage: page,
    //         hasMore: result.count > offset + result.rows.length
    //     };
    // }

    async getNewsfeed(currentUser, query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const interests = (currentUser && currentUser.interests) ? currentUser.interests : [];
        const result = await postRepository.findAllForNewsfeed({
            limit,
            offset,
            interests,
            sortBy: query.sortBy || 'id',
            order: query.order || 'DESC'
        });

        const hasMore = offset + result.rows.length < result.count;

        return {
            posts: result.rows,
            totalItems: result.count,
            currentPage: page,
            hasMore: hasMore,
            nextPage: hasMore ? page + 1 : null
        };
    }


    async sharePost(userId, postId) {
        // 1. Kiểm tra bài viết tồn tại

        
        const newPost = await postRepository.create(payload);
        // Tạo xong thì gọi lại hàm tìm theo id để lấy đủ thông tin bài mới
        return await postRepository.findById(newPost.id);
    }

    async updatePost(postId, userId, updateData) {
        const post = await postRepository.findById(postId);
        // Check xem bài này có trong database không
        if (!post) {
            throw new Error('Bài viết không tồn tại');
        }

        // So sánh chủ bài viết với id người đang đăng nhập
        if (post.users_id !== userId) {
            throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
        }

        const updatedPost = await postRepository.update(postId, {
            title: updateData.title || post.title,
            content: updateData.content || post.content,
            image_url: updateData.image_url || post.image_url,
        });

        return updatedPost;
    }

    async getNewsfeed(currentUser, query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;
        const sortBy = query.sortBy || 'id';
        const order = query.order || 'DESC';

        // Lấy danh sách sở thích của user để lọc bài cho chuẩn
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

        const post = await db.Post.findByPk(postId);
        if (!post) {
            throw new Error('Bài viết không tồn tại');
        }

        // Lưu thông tin người share và bài được share vào bảng trung gian
        return await db.SharePost.create({
            users_id: userId,
            posts_id: postId
        });
    }

    async getPostsByTagName(tagName) {
        return await db.Post.findAll({
            attributes: ['id', 'title', 'content', 'image_url'], 
            include: [
                {
                    model: db.Tag,
                    as: 'post_tags',
                    where: { 
                        // Tìm tag theo tên gần đúng
                        tags_name: { [Op.like]: `%${tagName}%` } 
                    },
                    attributes: ['id', 'tags_name'],
                    through: { attributes: [] } 
                },
                {
                    model: db.User,
                    as: 'user', 
                    attributes: ['id', 'username', 'avatarurl']
                }
            ],
            limit: 10 
        });
    }
    // Thêm vào class PostService trong file post.service.js
async getPostsByTagId(tagId, page = 1, limit = 10) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const offset = (p - 1) * l;

    const result = await postRepository.findByTagIdForScroll(tagId, l, offset);
    const hasMore = offset + result.rows.length < result.count;

    return {
        posts: result.rows,
        totalItems: result.count,
        currentPage: p,
        hasMore: hasMore,
        nextPage: hasMore ? p + 1 : null
    };
}
async getUserPosts(userId, page = 1, limit = 10) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const offset = (p - 1) * l;
    const posts = await postRepository.findByUserIdForScroll(userId, l + 1, offset);
    
    const hasMore = posts.length > l;
    const data = hasMore ? posts.slice(0, l) : posts;

    return {
        posts: data,
        hasMore: hasMore,
        nextPage: hasMore ? p + 1 : null
    };
}
}

module.exports = new PostService();