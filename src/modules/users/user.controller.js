const userService = require('./user.service');
const db = require('../../models');

class UserController {
    // Lấy thông tin cá nhân của mình, bao gồm cả mấy cái sở thích đã chọn
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

    // Cập nhật profile (tên, sđt...), có xử lý nếu user đổi ảnh đại diện mới
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = { ...req.body };
            // Nếu có up file ảnh thì lấy đường dẫn từ Cloudinary/Multer đẩy vào DB
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

    // Cập nhật danh sách sở thích (Tags)
    async updateInterests(req, res) {
        try {
            const userId = req.user.id;
            const { interests } = req.body;

            // Check xem model bảng trung gian có chạy ổn không
            if (!db.UserInterest) {
                throw new Error("Model UserInterest chưa được nạp. Kiểm tra file models/index.js");
            }

            // Tìm ID của các tag dựa trên tên tag mà user gửi lên
            const tags = await db.Tag.findAll({
                attributes: ['id', 'tags_name'], 
                where: { tags_name: interests }
            });

            if (tags.length === 0) {
                return res.status(400).json({ status: 'error', message: "Không tìm thấy sở thích nào khớp." });
            }

            // Xóa hết đống sở thích cũ của user này rồi mới nạp cái mới vào
            await db.UserInterest.destroy({ where: { users_id: userId } });

            const bulkData = tags.map(tag => ({
                users_id: userId,
                tag_id: tag.id
            }));

            // Lưu hàng loạt vào bảng trung gian
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

    // Tìm kiếm lung tung cả user lẫn bài viết theo từ khóa
    async globalSearch(req, res) {
        try {
            const query = req.query.q;
            if (!query || query.trim() === '') {
                return res.status(400).json({ message: 'Vui lòng nhập từ khóa' });
            }

            const results = await userService.searchAll(query);

            return res.json({
                status: 'success',
                data: results
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
} 

module.exports = new UserController();