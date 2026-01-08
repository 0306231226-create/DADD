require('dotenv').config(); // DÒNG NÀY PHẢI Ở TRÊN CÙNG
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log('Error: ' + err));