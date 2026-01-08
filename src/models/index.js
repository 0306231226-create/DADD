const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        try {
            const modelExport = require(path.join(__dirname, file));
            
            // CHỈ NẠP NẾU FILE LÀ MỘT FUNCTION
            if (typeof modelExport === 'function') {
                const model = modelExport(sequelize, Sequelize.DataTypes);
                
                // Chỉ thêm vào danh sách DB nếu model có tên (tránh file rỗng trả về {})
                if (model && model.name) {
                    db[model.name] = model;
                }
            }
        } catch (error) {
            console.error(`❌ Lỗi khi nạp file model: ${file}. Hãy kiểm tra xem file có trống không.`);
        }
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Thêm dòng này để kiểm tra trong console
sequelize.authenticate()
    .then(() => console.log('🚀 Database kết nối thành công!'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = db;