// models/user_interest.js
module.exports = (sequelize, DataTypes) => {
    const UserInterest = sequelize.define('UserInterest', {
        users_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
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