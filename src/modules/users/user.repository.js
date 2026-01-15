const { User } = require('../../models');

class UserRepository {
    // Tìm user theo ID, nhớ bỏ cái password_hash ra cho bảo mật
    async findById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] } 
        });
    }

    // Cập nhật thông tin user vào database theo ID truyền vào
    async update(id, updateData) {
        return await User.update(updateData, {
            where: { id }
        });
    }
}

module.exports = new UserRepository();