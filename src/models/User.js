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
        interests: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('interests');
                if (!rawValue) return [];
                try {
                    return JSON.parse(rawValue);
                } catch (e) {
                    return [];
                }
            },
            set(value) {
                this.setDataValue('interests', JSON.stringify(value));
            }
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    User.associate = (models) => {
        // Kiểm tra xem các model liên quan đã được load chưa
        if (models.Post) {
            User.hasMany(models.Post, { foreignKey: 'users_id', as: 'posts' });
        }
        if (models.Login) {
            // Lưu ý: Thông thường User -> Login là 1:1, kiểm tra lại logic nếu cần
            User.hasOne(models.Login, { foreignKey: 'users_id', as: 'loginInfo' });
        }
    };
    // src/models/User.js
User.associate = (models) => {
    // Các quan hệ khác (Post, Vote...)
    User.hasMany(models.Comment, { foreignKey: 'users_id', as: 'comments' });
};
    return User;
};