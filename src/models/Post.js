module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        users_id: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        image_url: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING, defaultValue: 'public' }
    }, {
        tableName: 'posts',
        timestamps: false
    });

    Post.associate = (models) => {
        if (models.User) {
            Post.belongsTo(models.User, { foreignKey: 'users_id', as: 'user' });
        }
    };

    return Post;
};