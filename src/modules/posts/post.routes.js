const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const postController = require('./post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const uploadCloud = require('../../config/cloudinary');

router.get('/user/:userId', authMiddleware, postController.getPostsByUser);
router.put('/:postId', authMiddleware, uploadCloud.single('image'), postController.updatePost);
router.post('/create', authMiddleware, uploadCloud.single('image'), postController.createPost);
router.post('/:postId/share', authMiddleware, postController.sharePost);
const voteController = require('../votes/vote.controller');

router.post('/:postId/vote', authMiddleware, voteController.votePost);

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return next();

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};


router.get('/', optionalAuth, postController.getNewsfeed);

module.exports = router;
