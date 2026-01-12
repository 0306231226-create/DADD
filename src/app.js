require('dotenv').config(); // Nạp biến môi trường từ file .env (PORT, DB_Config, Secret Key)

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// 1. MIDDLEWARE HỆ THỐNG (Cấu hình cơ bản)

// Cho phép các domain khác gọi API (Cần thiết khi chạy React/Vue hoặc Postman)
app.use(cors()); 

// Giải mã dữ liệu JSON gửi từ Postman/Frontend (giới hạn 50mb để nhận được ảnh base64)
app.use(express.json({ limit: '50mb' })); 

// Giải mã dữ liệu từ Form (urlencoded)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Giải mã Cookie từ trình duyệt gửi lên
app.use(cookieParser());

// Cấu hình thư mục chứa ảnh (Ví dụ: http://localhost:3000/uploads/avatar.png)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. IMPORT ROUTER (Nạp các file định nghĩa đường dẫn)
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const followRoutes = require('./modules/follows/follow.routes');

// 3. ĐĂNG KÝ ROUTES (Ánh xạ URL vào Controller)

/**
 * NHÓM 1: QUẢN LÝ TÀI KHOẢN
 * URL: /api/auth/... và /api/users/...
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

/**
 * NHÓM 2: BÀI VIẾT & TƯƠNG TÁC LỒNG NHAU (Để giống báo cáo đã nộp)
 * Cấu hình này giúp bạn có các đường dẫn như:
 * - GET /api/posts/11/comments  (Lấy danh sách cmt)
 * - POST /api/posts/11/comments (Tạo cmt mới)
 * - POST /api/posts/11/vote     (Vote/Unvote toggle)
 */
app.use('/api/posts', postRoutes);    // Router bài viết gốc
app.use('/api/posts', commentRoutes); // Gắn thêm logic comment vào /api/posts
app.use('/api/posts', voteRoutes);    // Gắn thêm logic vote vào /api/posts

/**
 * NHÓM 3: THAO TÁC TRỰC TIẾP (Để giữ cấu trúc cũ bạn thích)
 * Cấu hình này giúp bạn có các đường dẫn gọn gàng:
 * - DELETE /api/comments/14     (Xóa comment)
 * - POST /api/comments/14/reply (Trả lời comment)
 * - DELETE /api/votes/11        (Hủy vote kiểu trực tiếp)
 */
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

/**
 * NHÓM 4: CÁC TÍNH NĂNG KHÁC
 */
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);

// 4. XỬ LÝ LỖI (Error Handling)
// Bắt lỗi nếu dữ liệu JSON gửi lên bị sai định dạng (thiếu dấu ngoặc, phẩy...)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Dữ liệu JSON gửi lên không hợp lệ!' 
        });
    }
    next();
});

// Route kiểm tra server có đang sống hay không
app.get('/health', (req, res) => {
  res.json({ 
      status: 'OK',
      message: 'Server đang chạy bình thường',
      timestamp: new Date().toISOString()
  });
});

// Xử lý 404 - Nếu người dùng gọi sai URL
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Đường dẫn ${req.originalUrl} không tồn tại trên server.`
    });
});


// 5. KHỞI CHẠY SERVER


module.exports = app;