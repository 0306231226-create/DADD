module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define(
        'RefreshToken',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            users_id: { 
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

    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.User, { foreignKey: 'users_id' });
    };

    return RefreshToken;
};