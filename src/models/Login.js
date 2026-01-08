module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define('Login', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        users_id: { type: DataTypes.INTEGER, allowNull: false },
        password_hash: { type: DataTypes.STRING, allowNull: false },
        auth_provider: { type: DataTypes.STRING, defaultValue: 'local' }
    }, {
        tableName: 'logins',
        timestamps: false
    });

    Login.associate = (models) => {
        Login.belongsTo(models.User, { foreignKey: 'users_id' });
    };

    return Login;
};