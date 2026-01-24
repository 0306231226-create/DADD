require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Mạng Xã Hội',
            version: '1.0.0',
            description: 'Tài liệu API đầy đủ cho App Android. Lưu ý: Cần dùng Bearer Token cho các API bảo mật.',
        },
        servers: [
            {
                url: process.env.RENDER_EXTERNAL_URL ||`http://localhost:${process.env.PORT || 3000}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },

    apis: ['./modules/**/*.routes.js', './modules/**/*.js'], 
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const followRoutes = require('./modules/follows/follow.routes');

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/posts', voteRoutes);
app.use('/api/comments', commentRoutes); 
app.use('/api/votes', voteRoutes); 
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);

// Bắt lỗi JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Dữ liệu JSON gửi lên bị sai cú pháp rồi!' 
        });
    }
    next();
});

app.get('/health', (req, res) => {
  res.json({ 
      status: 'OK',
      message: 'Server vẫn chạy ngon lành',
      timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Link ${req.originalUrl} không có trên server.`
    });
});

module.exports = app;