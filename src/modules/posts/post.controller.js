const postService = require('./post.service');
const db = require('../../models');

class PostController {

    async getPostsByUser(req, res) {
        try {
            const { userId } = req.params;

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

    async getProfile(req, res) {
        try {
            const user = await db.User.findByPk(req.user.id, {
                include: [{
                    model: db.Tag,
                    as: 'userTags',
                    attributes: ['id', 'tags_name'],
                    through: { attributes: [] }
                }]
            });

            return res.json({ status: 'success', data: user });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }


    // async createPost(req, res) {
    //     try {
    //         const userId = req.user.id;
    //         if (!req.body.content) {
    //             return res.status(400).json({ message: 'Nội dung bài viết không được để trống' });
    //         }
    //         const post = await postService.createPost(userId, req.body);
    //         return res.status(201).json({ status: 'success', data: post });
    //     } catch (error) {
    //         return res.status(500).json({ status: 'error', message: error.message });
    //     }
    // }

    async createPost(req, res) {
        try {
            const userId = req.user.id;
            if (!req.body.content) {
                return res.status(400).json({ message: 'Nội dung bài viết không được để trống' });
            }
            const imageUrl = req.file ? req.file.path : null;
            const postData = {
                ...req.body,
                image_url: imageUrl
            };
            const post = await postService.createPost(userId, postData);
            return res.status(201).json({ status: 'success', data: post });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }


    async getNewsfeed(req, res) {
        try {
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
            const { title, content, tags } = req.body;
            const userId = req.user.id;


            const post = await db.Post.findOne({
                where: {
                    id: Number(postId),
                    users_id: Number(userId)
                }
            });

            if (!post) {
                return res.status(404).json({
                    status: 'error',
                    message: "Không tìm thấy bài viết hoặc bạn không có quyền chỉnh sửa"
                });
            }


            await post.update({ title, content });


            if (tags && Array.isArray(tags)) {
                const tagObjects = await db.Tag.findAll({
                    attributes: ['id', 'tags_name'],
                    where: { tags_name: tags }
                });

                if (tagObjects.length > 0) {

                    await db.PostTag.destroy({
                        where: { posts_id: postId }
                    });


                    const postTagData = tagObjects.map(t => ({
                        posts_id: postId,
                        tags_id: t.id
                    }));

                    await db.PostTag.bulkCreate(postTagData);
                }
            }
            return res.json({
                status: 'success',
                message: 'Cập nhật bài viết và tags thành công'
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
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