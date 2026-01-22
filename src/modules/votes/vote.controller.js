const voteService = require('./vote.service');

class VoteController {
    // Lấy số lượng upvote/downvote của bài viết và xem mình đã vote chưa
    async getPostVotes(req, res) {
        try {
            const { postId } = req.params;
            // Check ID từ token, nếu không login thì để null
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

    // Xử lý khi user bấm nút Upvote hoặc Downvote
    async votePost(req, res) {
        try {
            const { postId } = req.params;
            const { type } = req.body; // type thường là 'up' hoặc 'down'



            const userId = req.user.id || req.user.userId || req.user.users_id;

            if (!userId) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Không tìm thấy ID người dùng trong Token' 
                });
            }

            // Gọi service xử lý logic đổi vote hoặc tạo vote mới
            const totalScore = await voteService.toggleVote(userId, postId, type);
            
            return res.json({
                status: 'success',
                data: { totalScore }
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    // Hủy vote (nếu user bấm lại vào nút đã chọn để bỏ vote)
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