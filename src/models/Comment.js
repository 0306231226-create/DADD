module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comment: { 
            type: DataTypes.TEXT,
            allowNull: false, // Bắt buộc phải có nội dung
            validate: {
                notEmpty: true // Không cho phép chuỗi rỗng
            }
        },
        posts_id: { type: DataTypes.INTEGER, allowNull: false },
        users_id: { type: DataTypes.INTEGER, allowNull: false },
       parent_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            field: 'parent' // <--- "Nói" với Sequelize: Cột thực tế trong DB là 'parent'
        }
    }, {
        tableName: 'comments',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });
// src/models/Comment.js
Comment.associate = (models) => {
    // Quan hệ này giúp Sequelize hiểu khi bạn dùng: include: [{ model: User, as: 'user' }]
    Comment.belongsTo(models.User, { 
        foreignKey: 'users_id', 
        as: 'user' 
    });
};
    return Comment;
};