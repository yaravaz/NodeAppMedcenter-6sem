const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const db = require('./src/config/database');
const errorMiddleware = require('./src/middlewares/error-middleware');
//const {createInitialAdmin} = require('./src/createAdmin.js');
const {loadMedicationsFromJSON} = require('./src/insertData.js');
const { sequelize, User } = require('./src/config/database');
const bcrypt = require('bcrypt');

const userRouter = require('./src/routes/userRoutes');
const adminRouter = require('./src/routes/adminRoutes');
const patientRouter = require('./src/routes/patientRoutes');
const doctorRouter = require('./src/routes/doctorRoutes');
const appointmentRouter = require('./src/routes/appointmentRoute');
const medicalRouter = require('./src/routes/medicalRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials:true,
  origin: process.env.CLIENT_URL
}));

app.use('/auth', userRouter);
app.use('/admin', adminRouter);
app.use('/patients', patientRouter);
app.use('/doctors', doctorRouter);
app.use('/appointments', appointmentRouter);
app.use('/medical', medicalRouter);

app.use(errorMiddleware);

async function createInitialAdmin() {
  try {

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
    console.log('========================================');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

const syncDatabase = async () => {
  try {
    await db.sequelize.sync()
    console.log('База данных синхронизирована!');

    //await loadMedicationsFromJSON();
  } catch (e) {
    console.error('Ошибка при синхронизации базы данных:', e);
  }
};

const start = async () => {
  try{
    app.listen(process.env.SERVER_PORT, () => {console.log(`Server is running on port ${process.env.SERVER_PORT}`)});
  } catch(e){
    console.log(e);
  }
}

syncDatabase();
createInitialAdmin()
start();