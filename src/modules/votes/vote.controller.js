const voteService = require('./vote.service');

class VoteController {
    // 1. Lấy thống kê vote
    async getPostVotes(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user ? (req.user.id || req.user.userId || req.user.users_id) : null; 

            const stats = await voteService.getVoteStats(postId, userId);

            return res.json({
                status: 'success',
                data: stats
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // 2. Thực hiện Vote (Upvote/Downvote)
    async votePost(req, res) {
        try {
            const { postId } = req.params;
            const { type } = req.body;

        //    console.log("Nội dung Token giải mã:", req.user); 

            const userId = req.user.id || req.user.userId || req.user.users_id;

            if (!userId) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Không tìm thấy ID người dùng trong Token' 
                });
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

    // 3. Xóa Vote
    async deleteVote(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user.id || req.user.userId || req.user.users_id;

            const newScore = await voteService.cancelVote(userId, postId);

            return res.json({
                status: 'success',
                message: 'Đã hủy vote thành công',
                data: { totalScore: newScore }
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new VoteController();