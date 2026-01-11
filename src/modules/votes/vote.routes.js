const express = require('express');
const router = express.Router();
const voteController = require('./vote.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Nếu dòng này gây lỗi Undefined, hãy kiểm tra lại tên hàm trong Controller
router.get('/:postId/vote', authMiddleware, voteController.getPostVotes);

router.post('/:postId/vote', authMiddleware, voteController.votePost);

router.delete('/:postId/vote', authMiddleware, voteController.deleteVote);

module.exports = router;