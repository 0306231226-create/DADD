module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        follower_id: { type: DataTypes.INTEGER, allowNull: false },
        following_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'follows',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, { foreignKey: 'follower_id', as: 'follower' });
        Follow.belongsTo(models.User, { foreignKey: 'following_id', as: 'following' });
    };

    return Follow;
};