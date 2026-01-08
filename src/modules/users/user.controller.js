const userService = require('./user.service');

class UserController {
    async getProfile(req, res) {
        try {
            // req.user.id được lấy từ Auth Middleware sau khi verify token
            const userId = req.user.id;
            const user = await userService.getProfile(userId);
            return res.json({ status: 'success', data: user });
        } catch (error) {
            return res.status(404).json({ status: 'error', message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updatedUser = await userService.updateProfile(userId, req.body);
            return res.json({ 
                status: 'success', 
                message: 'Cập nhật thông tin thành công', 
                data: updatedUser 
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
    async updateMyInterests(req, res) {
    try {
        const userId = req.user.id; // Lấy từ authMiddleware
        const { interests } = req.body;

        if (!Array.isArray(interests)) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Sở thích phải là một mảng (Array)' 
            });
        }

        await userService.updateInterests(userId, interests);

        return res.json({
            status: 'success',
            message: 'Cập nhật sở thích thành công'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
}

module.exports = new UserController();