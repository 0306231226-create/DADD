require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// --- IMPORT ROUTES ---
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes'); // Chỉ khai báo 1 lần
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

// --- ĐĂNG KÝ ROUTES ---

// Auth & User
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Posts & liên quan (Vote, Comment)
app.use('/api/posts', postRoutes);    // Cho các route như /api/posts
app.use('/api/posts', voteRoutes);    // Cho các route như /api/posts/:postId/vote
app.use('/api/posts', commentRoutes); // Cho các route như /api/posts/:postId/comments

// Khác
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;