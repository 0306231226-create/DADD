const followService = require('./follow.service');

class FollowController {
 
    async followUser(req, res) {
        try {
            
            const followerId = req.user.id;
            
            const { userId: followingId } = req.params;

            
            const result = await followService.toggleFollow(followerId, followingId);

            return res.json({
                status: 'success',
                message: result.action === 'follow' ? 'Đã theo dõi' : 'Đã hủy theo dõi',
                data: result
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new FollowController();