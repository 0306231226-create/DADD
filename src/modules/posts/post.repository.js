const { Post, User } = require('../../models');

class PostRepository {
    async findAllByUserId(users_id) {
        return await Post.findAll({
            where: { users_id },
            order: [['id', 'DESC']],
            include: [{ model: User, as: 'user',attributes: ['username', 'avatarurl'] }]
        });
    }

    async create(postData) {
        return await Post.create(postData);
    }

   async findByUserIdForScroll(users_id, limit, offset) {
    return await Post.findAll({
        where: { users_id },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'DESC']],
        include: [{ 
            model: User, 
            as: 'user', 
            attributes: ['username', 'avatarurl'] 
        }]
    });
}
}

module.exports = new PostRepository();