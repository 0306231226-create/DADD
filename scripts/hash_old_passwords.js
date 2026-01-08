require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sequelize, Login } = require('../src/models')

const SALT_ROUNDS = 10

async function hashOldPasswords() {
  try {
    await sequelize.authenticate()
    console.log('✅ DB connected')

    const logins = await Login.findAll({
      attributes: ['id', 'users_id', 'password_hash'] // ⭐ chỉ lấy cột cần
    })

    for (const login of logins) {
      const pwd = login.password_hash

      if (!pwd) continue
      if (pwd.startsWith('$2')) {
        console.log(`⏭ User ${login.users_id} đã hash`)
        continue
      }

      const hashed = await bcrypt.hash(pwd, SALT_ROUNDS)

      await Login.update(
        { password_hash: hashed },
        { where: { id: login.id } }
      )

      console.log(`✅ Hash password user ${login.users_id}`)
    }

    console.log('🎉 HASH HOÀN TẤT')
    process.exit(0)
  } catch (err) {
    console.error('❌ Lỗi:', err.message)
    process.exit(1)
  }
}

hashOldPasswords()
