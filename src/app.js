require('dotenv').config() // 🔥 BẮT BUỘC PHẢI Ở DÒNG ĐẦU

const express = require('express')
const cors = require('cors')

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');


const app = express()

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})
app.use('/api/users', userRoutes);

app.use('/api/posts', require('./modules/posts/post.routes'));

module.exports = app
