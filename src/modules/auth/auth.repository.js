const { User, Login } = require('../../models');

class AuthRepository {
    async findUserByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async createUser(userData, transaction) {
        return await User.create(userData, { transaction });
    }

    async createLogin(loginData, transaction) {
        return await Login.create(loginData, { transaction });
    }

    async findUserByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    async findLoginByUserId(users_id) {
        return await Login.findOne({
            where: { users_id }

        });
    }

    async updatePassword(users_id, newPasswordHash) {
        return await Login.update(
            { password_hash: newPasswordHash },
            { where: { users_id } }
        );
    }
}

module.exports = new AuthRepository();