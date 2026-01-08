const authRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { sequelize } = require('../../models');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class AuthService {
    async register({ username, email, password }) {
        const transaction = await sequelize.transaction();
        try {
            const existingUser = await authRepository.findUserByEmail(email);
            if (existingUser) throw new Error('Email đã tồn tại');

            const newUser = await authRepository.createUser({ username, email, role: 'user' }, transaction);
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            await authRepository.createLogin({
                users_id: newUser.id,
                password_hash: passwordHash,
                auth_provider: 'local'
            }, transaction);

            await transaction.commit();
            return { message: 'Đăng ký thành công' };
        } catch (error) {
            await transaction.rollback();
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
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        } catch (err) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    async forgotPassword(email) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) throw new Error('Email không tồn tại trong hệ thống');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetToken = jwt.sign({ email, otp }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã xác thực đổi mật khẩu',
            html: `<h3>Mã OTP của bạn là: <b style="color:red;">${otp}</b></h3><p>Hết hạn sau 5 phút.</p>`
        });

        return { resetToken };
    }

    async resetPassword(otp, newPassword, resetToken) {
        const decoded = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET);
        if (decoded.otp !== otp) throw new Error('Mã OTP không chính xác');

        const user = await authRepository.findUserByEmail(decoded.email);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await authRepository.updatePassword(user.id, hash);
        return { message: 'Đổi mật khẩu thành công' };
    }
}

module.exports = new AuthService();