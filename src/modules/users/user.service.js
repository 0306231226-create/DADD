const userRepository = require('./user.repository');

class UserService {
    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error('Người dùng không tồn tại');
        return user;
    }

    async updateProfile(userId, updateData) {
        
        const allowedUpdates = [
            'username', 
            'avatarurl', 
            'gender', 
            'phone', 
            'birthday'
        ];
        
        const filteredData = {};
        allowedUpdates.forEach(key => {
            if (updateData[key] !== undefined) {
                filteredData[key] = updateData[key];
            }
        });

        await userRepository.update(userId, filteredData);
        return await userRepository.findById(userId);
    }
}

module.exports = new UserService();