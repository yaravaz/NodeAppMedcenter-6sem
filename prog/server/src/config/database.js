const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: console.log,
});

const User = require('../models/User').ORM(sequelize);
const Patient = require('../models/Patient').ORM(sequelize);
const Schedule = require('../models/Schedule').ORM(sequelize);
const Doctor = require('../models/Doctor').ORM(sequelize);
const Category = require('../models/Category').ORM(sequelize);
const Medication = require('../models/Medication').ORM(sequelize);
const Appointment = require('../models/Appointment').ORM(sequelize);
const MedicalResult = require('../models/MedicalResult').ORM(sequelize);
const Diagnosis = require('../models/Diagnosis').ORM(sequelize);
const Disease = require('../models/Disease').ORM(sequelize);
const DiagnosedDisease = require('../models/DiagnosedDisease').ORM(sequelize);
const PrescribedMedication = require('../models/PrescribedMedication').ORM(sequelize);
const TokenUser = require('../models/Token-User').ORM(sequelize);


let connection = sequelize.authenticate();
// const testConnection = async () => {
//   try {
//     connection = await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// testConnection();


Patient.hasMany(Appointment, { as: 'Appointments', foreignKey: 'Patient_ID' });
Patient.hasMany(MedicalResult, { foreignKey: 'Patient_ID' });
Patient.hasMany(Diagnosis, { foreignKey: 'Patient_ID' });

Doctor.hasMany(Appointment, { foreignKey: 'Doctor_ID' });
Doctor.hasMany(MedicalResult, { foreignKey: 'Doctor_ID' });
Doctor.hasMany(Diagnosis, { foreignKey: 'Doctor_ID' });
Doctor.hasMany(Schedule, { foreignKey: 'Doctor_ID' });

//Category.hasMany(Doctor, { foreignKey: 'Category_ID'})

Diagnosis.hasMany(PrescribedMedication, { foreignKey: 'Diagnosis_ID' });
Diagnosis.hasMany(DiagnosedDisease, { foreignKey: 'Diagnosis_ID' });

Disease.hasMany(DiagnosedDisease, { foreignKey: 'Disease_ID' });
DiagnosedDisease.belongsTo(Disease, { foreignKey: 'Disease_ID' });

PrescribedMedication.belongsTo(Diagnosis, { foreignKey: 'Diagnosis_ID' });
PrescribedMedication.belongsTo(Medication, { foreignKey: 'Medication_ID' });

User.hasOne(Patient, { foreignKey: 'User_ID' });
User.hasOne(Doctor, { foreignKey: 'User_ID' });
User.hasOne(TokenUser, { foreignKey: 'User_ID', onDelete: 'CASCADE'});

Appointment.belongsTo(Patient, { as: 'Patient', foreignKey: 'Patient_ID'});
Appointment.belongsTo(Doctor, { as: 'Doctor', foreignKey: 'Doctor_ID'});
Patient.belongsTo(User, { foreignKey: 'User_ID' });
Doctor.belongsTo(User, { foreignKey: 'User_ID' });
TokenUser.belongsTo(User, { foreignKey: 'User_ID' });

DiagnosedDisease.belongsTo(Diagnosis, { foreignKey: 'Diagnosis_ID' }); 
DiagnosedDisease.belongsTo(Disease, { foreignKey: 'Disease_ID' });

Diagnosis.hasMany(DiagnosedDisease, { foreignKey: 'Diagnosis_ID'});
Disease.hasMany(DiagnosedDisease, { foreignKey: 'Disease_ID'});

Diagnosis.hasMany(PrescribedMedication, { foreignKey: 'Diagnosis_ID'});
Medication.hasMany(PrescribedMedication, { foreignKey: 'Medication_ID'});

module.exports = {sequelize, connection, User, Patient, Schedule, Doctor, Medication, Appointment, MedicalResult, Diagnosis, Disease, DiagnosedDisease, PrescribedMedication, TokenUser };

