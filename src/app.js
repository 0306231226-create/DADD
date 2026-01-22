require('dotenv').config(); // Đọc file .env để lấy mấy cái bảo mật như Secret Key, Port...

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();


app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const followRoutes = require('./modules/follows/follow.routes');


//  Login, Đăng ký và Quản lý User
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//  Bài viết và các tương tác xoay quanh bài viết
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/posts', voteRoutes);

// Các thao tác lẻ trực tiếp trên Comment hoặc Vote
app.use('/api/comments', commentRoutes); 
app.use('/api/votes', voteRoutes); 

// Follow người dùng và thông báo hệ thống
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);



// Bắt lỗi nếu client gửi JSON sai cú pháp (thiếu ngoặc, phẩy...)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Dữ liệu JSON gửi lên bị sai cú pháp rồi!' 
        });
    }
    next();
});

// Link test nhanh 
app.get('/health', (req, res) => {
  res.json({ 
      status: 'OK',
      message: 'Server vẫn chạy ngon lành',
      timestamp: new Date().toISOString()
  });
});

// Bắt các URL không tồn tại 
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cái link ${req.originalUrl} này không có trên server đâu.`
    });
});

// Xuất app ra để file bin/www hoặc index.js khởi chạy server
module.exports = app;