require('dotenv').config(); 
const app = require('./app');
const { sequelize } = require('./models'); 
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {

        await sequelize.authenticate();
        console.log('✅ Database connected thành công!');


        await sequelize.sync({ alter: true });
        console.log('✅ Tất cả các bảng đã được đồng bộ!');

       
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
            console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        console.error('❌ Lỗi khởi động server:', err);
    }
};

startServer();