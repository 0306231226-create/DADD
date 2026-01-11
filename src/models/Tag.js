module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Tag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tags_name: { 
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'tags',
        timestamps: false
    });
};