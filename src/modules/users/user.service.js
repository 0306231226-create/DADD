const db = require('../../models');

class UserService {
    // Lấy Profile kèm mảng các Tag sở thích
    async getProfile(userId) {
        const user = await db.User.findByPk(userId, {
            attributes: { exclude: ['password'] }, // Không trả về mật khẩu
            include: [{
                model: db.Tag,
                as: 'userTags', // Tên alias phải khớp với định nghĩa trong models/index.js
                attributes: ['id', 'tags_name'],
                through: { attributes: [] } // Không lấy dữ liệu từ bảng trung gian
            }]
        });
        if (!user) throw new Error('Người dùng không tồn tại');
        return user;
    }

    // Cập nhật thông tin cơ bản
    async updateProfile(userId, updateData) {
        const user = await db.User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');
        
        return await user.update(updateData);
    }

    // Cập nhật sở thích vào bảng trung gian user_interests
    async updateInterests(userId, tagIds) {
        const user = await db.User.findByPk(userId);
        if (!user) throw new Error('Người dùng không tồn tại');

        // Sequelize sẽ tự xóa các tag cũ và thêm tag mới vào bảng user_interests
        // Hàm setUserTags được tạo tự động từ liên kết belongsToMany
        await user.setUserTags(tagIds);
        
        return true;
    }
}

module.exports = new UserService();