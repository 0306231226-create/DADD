require('dotenv').config(); // 1. Load cấu hình môi trường đầu tiên

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 2. Khởi tạo app (Phải đặt trước khi sử dụng app.use)
const app = express();

// 3. Cài đặt các Middleware cơ bản
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 4. Import các Routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

app.use('/api/notifications', notificationRoutes);
app.use('/api', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Gộp các route liên quan đến bài viết vào đây
app.use('/api/posts', postRoutes);    // Quản lý bài viết
app.use('/api/posts', commentRoutes); // Quản lý bình luận (vì route là /posts/:postId/comments)

// Đối với Vote, nếu file vote.routes.js của bạn đã có prefix /posts trong đó
// thì dùng app.use('/api', voteRoutes)
app.use('/api', voteRoutes); 

// 6. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;