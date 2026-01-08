const express = require('express');
const router = express.Router();
const voteController = require('./vote.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post('/posts/:postId/vote', authMiddleware, voteController.votePost);
router.delete('/posts/:postId/vote', authMiddleware, voteController.deleteVote);
module.exports = router;