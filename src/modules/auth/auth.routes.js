const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

module.exports = router;


/**
 * @swagger
 * tags:
 * name: Auth
 * description: Quản lý xác thực và tài khoản
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 * post:
 * summary: Yêu cầu lấy lại mật khẩu (Gửi mã OTP)
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * example: user@example.com
 * responses:
 * 200:
 * description: Thông báo gửi mã thành công (kể cả khi email không tồn tại để bảo mật)
 */

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Đăng nhập hệ thống
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Trả về Access Token
 */