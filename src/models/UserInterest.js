// src/models/UserInterest.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserInterest', {
        users_id: { type: DataTypes.INTEGER, primaryKey: true },
        tag_id: { type: DataTypes.INTEGER, primaryKey: true }
    }, {
        tableName: 'user_interests',
        timestamps: false
    });
};