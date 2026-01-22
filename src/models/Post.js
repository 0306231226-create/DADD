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
    if (models.Tag && models.PostTag) {
        Post.belongsToMany(models.Tag, { 
            through: models.PostTag, 
            foreignKey: 'posts_id', 
            otherKey: 'tags_id',
            as: 'post_tags' 
        });
    }
};
    return Post;
};