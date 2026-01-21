const express = require('express');
const router = express.Router();
const voteController = require('./vote.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/:postId/vote', authMiddleware, voteController.getPostVotes);

router.post('/:postId/vote', authMiddleware, voteController.votePost);

router.delete('/:postId/vote', authMiddleware, voteController.deleteVote);

module.exports = router;