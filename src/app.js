require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const voteRoutes = require('./modules/votes/vote.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
app.use('/api/follows', require('./modules/follows/follow.routes'));

app.use('/api/notifications', notificationRoutes);
app.use('/api', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/posts', postRoutes);    
app.use('/api/posts', commentRoutes); 
app.use('/api', voteRoutes); 


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;