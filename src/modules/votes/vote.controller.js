const voteService = require('./vote.service');

class VoteController {
    async votePost(req, res) {
        try {
            const { postId } = req.params;
            const { type } = req.body; // 'upvote' hoặc 'downvote'
            const userId = req.user.id;

            if (!['upvote', 'downvote'].includes(type)) {
                return res.status(400).json({ status: 'error', message: 'Type phải là upvote hoặc downvote' });
            }

            const totalScore = await voteService.toggleVote(userId, postId, type);

            return res.json({
                status: 'success',
                data: { totalScore }
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
async getPostVotes(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user ? req.user.id : null; // Lấy ID người dùng nếu đã đăng nhập

            const stats = await voteService.getVoteStats(postId, userId);

            return res.json({
                status: 'success',
                data: stats
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
async deleteVote(req, res) {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const newScore = await voteService.cancelVote(userId, postId);

        return res.json({
            status: 'success',
            message: 'Đã hủy vote thành công',
            data: { totalScore: newScore }
        });
    } catch (error) {
        return res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
}
}

module.exports = new VoteController();