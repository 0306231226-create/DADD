module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', { // <--- Tên model phải là 'Vote'
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        posts_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vote_type: {
            type: DataTypes.ENUM('upvote', 'downvote'),
            allowNull: false
        }
    }, {
        tableName: 'votes',
        timestamps: false
    });

    return Vote;
};