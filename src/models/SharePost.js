// src/models/SharePost.js
module.exports = (sequelize, DataTypes) => {
    const SharePost = sequelize.define('SharePost', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id: { type: DataTypes.INTEGER, allowNull: false },
        posts_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'share_posts', 
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return SharePost;
};