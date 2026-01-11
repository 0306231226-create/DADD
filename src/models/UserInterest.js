// models/user_interest.js
module.exports = (sequelize, DataTypes) => {
    const UserInterest = sequelize.define('UserInterest', {
        users_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Nếu bảng không có cột id riêng, hãy đặt primaryKey ở đây
        },
        tag_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }
    }, {
        tableName: 'user_interests', // Tên bảng thực tế trong MySQL
        timestamps: false
    });

    return UserInterest;
};