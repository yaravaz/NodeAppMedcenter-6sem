const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { sequelize, User } = require('./config/database');
const bcrypt = require('bcrypt');


async function createInitialAdmin() {
  let connection;
  try {
    await sequelize.sync();
    console.log('База данных синхронизирована!');

    const adminLogin = 'adminadmin';
    const adminPassword = 'admin123';
    
    const existingAdmin = await User.findOne({ where: { Login: adminLogin } });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashPassword = await bcrypt.hash(adminPassword, 3);
    await User.create({
      Login: adminLogin,
      Password: hashPassword,
      Role: 'admin'
    });

    console.log('========================================');
    console.log('Default admin created:');
    console.log(`Login: ${adminLogin}`);
    console.log(`Password: ${adminPassword}`);
    console.log('CHANGE PASSWORD AFTER FIRST LOGIN!');
    console.log('========================================');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    if (connection) {
      await sequelize.close();
    }
  }
}

module.exports = {createInitialAdmin};