module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define(
        'RefreshToken', // Tên model nên viết hoa chữ cái đầu, số ít
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            users_id: { // Lưu ý: Database của bạn thường dùng users_id (có s), hãy kiểm tra lại SQL
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            tableName: 'refresh_tokens',
            timestamps: false
        }
    );

    // Thiết lập quan hệ nếu cần
    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.User, { foreignKey: 'users_id' });
    };

    return RefreshToken;
};