module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        user_id: {
            type: DataTypes.INTEGER,
            field: 'users_id', // Khớp với ảnh của bạn
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            field: 'posts_id', // Khớp với ảnh của bạn
            primaryKey: true
        },
        vote_type: {
            type: DataTypes.INTEGER,
            field: 'votetype' // Kiểm tra kỹ lại ảnh, nếu cột là 'votetype' thì dùng tên này
        }
    }, {
        tableName: 'votes',
        // QUAN TRỌNG: Tắt timestamps vì bảng không có cột createdAt/updatedAt
        timestamps: false 
    });

    return Vote;
};