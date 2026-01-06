const express = require('express')
const cors = require('cors')

const authRoutes = require('./modules/auth/auth.routes')
const userRoutes = require('./modules/users/user.routes')
const postRoutes = require('./modules/posts/post.routes')
const voteRoutes = require('./modules/votes/vote.routes')
const commentRoutes = require('./modules/comments/comment.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/comments', commentRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

module.exports = app
