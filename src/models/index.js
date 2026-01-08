const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize'); // Khai báo LẦN 1 (để lấy Class)
const basename = path.basename(__filename);
require('dotenv').config();

const db = {};

// Khởi tạo instance kết nối
const sequelize = new Sequelize(
    process.env.DB_NAME || 'dadđ', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASS || '', 
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

// Tự động nạp các file models trong thư mục này
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        try {
            const modelExport = require(path.join(__dirname, file));
            
            if (typeof modelExport === 'function') {
                const model = modelExport(sequelize, Sequelize.DataTypes);
                if (model && model.name) {
                    db[model.name] = model;
                }
            }
        } catch (error) {
            console.error(`❌ Lỗi khi nạp file model: ${file}`);
        }
    });

// Thiết lập quan hệ (associations) giữa các bảng
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Xuất đối tượng db để các nơi khác sử dụng
module.exports = db;