const express = require('express');
const router = express.Router();
const voteController = require('./vote.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/:postId/vote', authMiddleware, voteController.getPostVotes);

// Gửi vote mới hoặc đổi loại vote (Up sang Down và ngược lại)
router.post('/:postId/vote', authMiddleware, voteController.votePost);

// Hủy vote, đưa trạng thái về như chưa từng bấm
router.delete('/:postId/vote', authMiddleware, voteController.deleteVote);

module.exports = router;