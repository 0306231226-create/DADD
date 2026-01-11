const userService = require('./user.service');

class UserController {
    // 1. Lấy thông tin cá nhân kèm sở thích
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await userService.getProfile(userId);
            return res.json({ 
                status: 'success', 
                data: user 
            });
        } catch (error) {
            return res.status(404).json({ 
                status: 'error', 
                message: error.message 
            });
        }
    }

    // 2. Cập nhật thông tin cơ bản (tên, avatar, phone...)
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
            return res.status(400).json({ 
                status: 'error', 
                message: error.message 
            });
        }
    }

    // 3. Cập nhật sở thích (Xử lý mảng ID)
    async updateMyInterests(req, res) {
        try {
            const userId = req.user.id;
            const { interests } = req.body; // Mong đợi mảng [1, 2, 5]

            if (!Array.isArray(interests)) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Dữ liệu sở thích phải là một mảng (Array)' 
                });
            }

            await userService.updateInterests(userId, interests);

            return res.json({
                status: 'success',
                message: 'Cập nhật danh sách sở thích thành công'
            });
        } catch (error) {
            return res.status(500).json({ 
                status: 'error', 
                message: error.message 
            });
        }
    }
}

// QUAN TRỌNG: module.exports phải nằm NGOÀI dấu ngoặc nhọn của Class
module.exports = new UserController();