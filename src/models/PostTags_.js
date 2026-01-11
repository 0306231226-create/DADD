module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PostTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        posts_id: { // Phải có chữ 's'
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tags_id: { // Phải có chữ 's'
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'posts_tags',
        timestamps: false
    });
};