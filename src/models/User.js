module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        role: { type: DataTypes.STRING, defaultValue: 'user' },
        avatarurl: { type: DataTypes.STRING },
        gender: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        birthday: { type: DataTypes.DATEONLY },
        status: { type: DataTypes.STRING, defaultValue: 'active' },
        
    }, {
        tableName: 'users',
        timestamps: false
    });

    User.associate = (models) => {
        if (models.Post) {
            User.hasMany(models.Post, { foreignKey: 'users_id', as: 'posts' });
        }
        if (models.Login) {
            
            User.hasOne(models.Login, { foreignKey: 'users_id', as: 'loginInfo' });
        }
    };
    
User.associate = (models) => {

    User.hasMany(models.Comment, { foreignKey: 'users_id', as: 'comments' });
};
    return User;
};