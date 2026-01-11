// src/models/Notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        title: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        content: { 
            type: DataTypes.TEXT, 
            allowNull: false 
        },
        is_seen: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false 
        }
    }, {
        tableName: 'notifications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Notification;
};