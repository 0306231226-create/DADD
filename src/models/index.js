const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
require('dotenv').config();

const db = {};

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

// 1. Tự động nạp các file models
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
            console.error(`❌ Lỗi khi nạp file model: ${file}`, error);
        }
    });

// 2. KHÔNG VIẾT QUAN HỆ RỜI RẠC Ở ĐÂY. 
// Nếu bạn muốn viết quan hệ trực tiếp trong file này, phải dùng db.User và db.Tag:
if (db.User && db.Tag && db.UserInterest) {
    db.User.belongsToMany(db.Tag, { 
        through: db.UserInterest, 
        foreignKey: 'users_id', 
        as: 'userTags' 
    });

    db.Tag.belongsToMany(db.User, { 
        through: db.UserInterest, 
        foreignKey: 'tag_id' 
    });
}

// 3. Tự động gọi hàm associate bên trong từng file model (Khuyên dùng)
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;