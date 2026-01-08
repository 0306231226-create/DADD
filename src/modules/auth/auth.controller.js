const authService = require('./auth.service');

class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { user, accessToken, refreshToken } = await authService.login(req.body);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 });
            res.json({ status: 'success', data: { user, accessToken } });
        } catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) return res.status(401).json({ message: 'No refresh token' });
            const accessToken = await authService.refreshToken(token);
            res.json({ status: 'success', accessToken });
        } catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const result = await authService.forgotPassword(req.body.email);
            res.json({ status: 'success', message: 'OTP đã gửi', resetToken: result.resetToken });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { otp, newPassword, resetToken } = req.body;
            const result = await authService.resetPassword(otp, newPassword, resetToken);
            res.json({ status: 'success', message: result.message });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.json({ status: 'success', message: 'Logged out' });
    }
}

module.exports = new AuthController();