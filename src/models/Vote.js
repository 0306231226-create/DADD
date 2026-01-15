module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        user_id: {
            type: DataTypes.INTEGER,
            field: 'users_id', 
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            field: 'posts_id', 
            primaryKey: true
        },
        vote_type: {
            type: DataTypes.INTEGER,
            field: 'votetype'
        }
    }, {
        tableName: 'votes',
        timestamps: false 
    });

    return Vote;
};