const db = require('../../models');
const { Sequelize } = require('sequelize');
class UserService {
    // Lấy Profile kèm mảng các Tag sở thích
    // async getProfile(userId) {
    //     const user = await db.User.findByPk(userId, {
    //         attributes: { exclude: ['password'] },
    //         include: [{
    //             model: db.Tag,
    //             as: 'userTags',
    //             attributes: ['id', 'tags_name'],
    //             through: { attributes: [] }
    //         }]
    //     });

    //     if (!user) throw new Error('Người dùng không tồn tại');
    //     return user;
    // }





    async getProfile(userId) {
        const user = await db.User.findByPk(userId, {
            attributes: {
                exclude: ['password'],
                include: [
                    [
                        db.sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM Follows AS f
                            WHERE f.following_id = ${userId}
                        )`),
                        'followersCount'
                    ],
                    [
                        db.sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM Follows AS f
                            WHERE f.follower_id = ${userId}
                        )`),
                        'followingCount'
                    ]
                ]
            },
            include: [{
                model: db.Tag,
                as: 'userTags',
                attributes: ['id', 'tags_name'],
                through: { attributes: [] }
            }]
        });

        if (!user) throw new Error('Người dùng không tồn tại');
        return user;
    }





    // Cập nhật thông tin cơ bản
    async updateProfile(userId, updateData) {
        const user = await db.User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');

        // Chỉ cho phép update các field an toàn
        const allowedUpdates = [
            'username',
            'avatarurl',
            'gender',
            'phone',
            'birthday'
        ];

        const filteredData = {};
        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                filteredData[key] = updateData[key];
            }
        }

        return await user.update(filteredData);
    }

    // Cập nhật sở thích (bảng user_interests)
    async updateInterests(userId, tagIds) {
        const user = await db.User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');

        // Sequelize tự động sync bảng trung gian
        await user.setUserTags(tagIds);

        return true;
    }
}

module.exports = new UserService();
