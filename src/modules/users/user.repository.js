const { User } = require('../../models');

class UserRepository {
    async findById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] } 
        });
    }

    async update(id, updateData) {
        return await User.update(updateData, {
            where: { id }
        });
    }
}

module.exports = new UserRepository();