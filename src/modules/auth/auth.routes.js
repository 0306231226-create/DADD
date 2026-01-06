const express = require('express')
const router = express.Router()

// Đăng ký
router.post('/register', (req, res) => {
  res.json({ message: 'Register API' })
})

// Đăng nhập
router.post('/login', (req, res) => {
  res.json({ message: 'Login API' })
})

// Đăng xuất
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout API' })
})

// Refresh token
router.post('/refresh-token', (req, res) => {
  res.json({ message: 'Refresh token API' })
})

// Quên mật khẩu
router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Forgot password API' })
})

// Xác nhận OTP + đổi mật khẩu
router.post('/verify-otp', (req, res) => {
  res.json({ message: 'Verify OTP API' })
})

module.exports = router
