module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comment: { 
            type: DataTypes.TEXT,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        posts_id: { type: DataTypes.INTEGER, allowNull: false },
        users_id: { type: DataTypes.INTEGER, allowNull: false },
       parent_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            field: 'parent' 
        }
    }, {
        tableName: 'comments',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',

        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

Comment.associate = (models) => {
   
    Comment.belongsTo(models.User, { 
        foreignKey: 'users_id', 
        as: 'user' 
    });
};
    return Comment;
};