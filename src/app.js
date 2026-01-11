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
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const followRoutes = require('./modules/follows/follow.routes');

// --- ĐĂNG KÝ ROUTES ---

// Auth & User
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Posts & liên quan
app.use('/api/posts', postRoutes);      // /api/posts
app.use('/api/posts', voteRoutes);      // /api/posts/:postId/vote
app.use('/api/posts', commentRoutes);   // /api/posts/:postId/comments

// Follow
app.use('/api/follows', followRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;
