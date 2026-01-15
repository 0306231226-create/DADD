const userService = require('./user.service');
const db = require('../../models');

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
    // async updateProfile(req, res) {
    //     try {
    //         const userId = req.user.id;
    //         const updatedUser = await userService.updateProfile(userId, req.body);
    //         return res.json({ 
    //             status: 'success', 
    //             message: 'Cập nhật thông tin thành công', 
    //             data: updatedUser 
    //         });
    //     } catch (error) {
    //         return res.status(400).json({ 
    //             status: 'error', 
    //             message: error.message 
    //         });
    //     }
    // }


    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = { ...req.body };
            if (req.file) {
                updateData.avatarurl = req.file.path;
            }
            const updatedUser = await userService.updateProfile(userId, updateData);

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



    // 3. Cập nhật sở thích (Xử lý mảng tên tag)
    async updateInterests(req, res) {
        try {
            const userId = req.user.id;
            const { interests } = req.body;

            // 1. Kiểm tra Model trung gian có tồn tại không
            if (!db.UserInterest) {
                throw new Error("Model UserInterest chưa được nạp. Kiểm tra file models/index.js");
            }

            // 2. Tìm Tags và ép buộc KHÔNG lấy cột 'name'
            const tags = await db.Tag.findAll({
                attributes: ['id', 'tags_name'], // Chỉ lấy id và tags_name
                where: { tags_name: interests }
            });

            if (tags.length === 0) {
                return res.status(400).json({ status: 'error', message: "Không tìm thấy sở thích nào khớp." });
            }

            // 3. Xóa cũ và thêm mới trực tiếp vào bảng trung gian
            await db.UserInterest.destroy({ where: { users_id: userId } });

            const bulkData = tags.map(tag => ({
                users_id: userId,
                tag_id: tag.id
            }));

            await db.UserInterest.bulkCreate(bulkData);

            return res.json({
                status: 'success',
                message: 'Cập nhật thành công cho ID ' + userId,
                data: tags.map(t => t.tags_name)
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
} // Kết thúc class UserController

module.exports = new UserController();