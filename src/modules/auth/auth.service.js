const authRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../../services/mail.service');
const { sequelize } = require('../../models');

class AuthService {

    async register({ username, email, password }) {
        const transaction = await sequelize.transaction();
        try {
            const existingUser = await authRepository.findUserByEmail(email);
            if (existingUser) throw new Error('Email hoặc username đã tồn tại');

            const existingUsername = await authRepository.findUserByUsername(username);
            if (existingUsername) throw new Error('Email hoặc username đã tồn tại');

            const newUser = await authRepository.createUser({ username, email,brithday, role: 'user' }, transaction);
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            await authRepository.createLogin({
                users_id: newUser.id,
                password_hash: passwordHash,
                auth_provider: 'local'
            }, transaction);
            console.log(username, email, password);
            await transaction.commit();
            return { message: 'Đăng ký thành công' };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async refreshToken(token) {
        try {
            if (!token) {
                throw new Error('Không tìm thấy token');
            }
            let cleanToken = token;
            if (typeof token === 'string') {
                if (token.includes('refreshToken=')) {
                    cleanToken = token.split('refreshToken=')[1].split(';')[0];
                }
                cleanToken = cleanToken.trim();
            }

            if (!process.env.JWT_REFRESH_SECRET) {
                throw new Error('Server chưa cấu hình mã bí mật REFRESH_SECRET');
            }

            const decoded = jwt.verify(cleanToken, process.env.JWT_REFRESH_SECRET);
            const user = await authRepository.findLoginByUserId(decoded.id);
            if (!user) {
                throw new Error('Người dùng không tồn tại hoặc đã bị khóa');
            }

            const payload = {
                id: user.id,
                role: user.role
            };

            const newAccessToken = jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1h' }
            );

            return newAccessToken;

        } catch (error) {
            console.error("❌ Lỗi Refresh Token:", error.message);

            if (error.name === 'TokenExpiredError') {
                throw new Error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
            }

            if (error.name === 'JsonWebTokenError') {
                throw new Error('Mã xác thực không hợp lệ hoặc đã bị chỉnh sửa');
            }

            throw error;
        }
    }

    async login({ email, password }) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) throw new Error('Email hoặc mật khẩu không đúng');

        const loginInfo = await authRepository.findLoginByUserId(user.id);

        const isMatch = await bcrypt.compare(password, loginInfo.password_hash);
        if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng');

        const payload = { id: user.id, role: user.role };
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '8h' });

        return { user, accessToken, refreshToken };
    }


    async forgotPassword(email) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) throw new Error('Email không tồn tại trong hệ thống');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        const resetToken = jwt.sign(
            { email, otp },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '2m' }
        );

        await transporter.sendMail({
            from: '"Hệ thống MXH" <admin@socialapp.com>',
            to: email,
            subject: 'Mã xác thực đổi mật khẩu',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Mã xác thực OTP</h2>
                    <p>Mã của bạn là: <b style="color:red; font-size: 20px;">${otp}</b></p>
                    <p>Vui lòng nhập mã này kèm với token để đổi mật khẩu. Hết hạn sau 2 phút.</p>
                </div>`
        });

        return { resetToken };
    }


    async resetPassword(otp, newPassword, resetToken) {
        try {
            const decoded = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET);
            if (String(decoded.otp) !== String(otp)) {
                throw new Error('Mã OTP không chính xác');
            }
            const user = await authRepository.findUserByEmail(decoded.email);
            if (!user) throw new Error('Người dùng không còn tồn tại');

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            await authRepository.updatePassword(user.id, hash);
            return { message: 'Đổi mật khẩu thành công' };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Phiên làm việc đã hết hạn, vui lòng yêu cầu mã mới');
            }
            throw error;
        }
    }
}

module.exports = new AuthService();