require('dotenv').config(); 
const app = require('./app');
const { sequelize } = require('./models'); // Lấy sequelize đã cấu hình từ models

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected thành công!');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Không thể kết nối Database:', err);
    });