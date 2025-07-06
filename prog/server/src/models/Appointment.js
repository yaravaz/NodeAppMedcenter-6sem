const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');
const Patient = require('./Patient');

class Appointment extends Model {}

function appointmentORM(sequelize){
  Appointment.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Patient_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'ID',
      },
    },
    Doctor_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Doctors',
        key: 'ID',
      },
    },
    Appointment_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isDenied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'Appointments',
    timestamps: false,
  });
}

exports.ORM = (s) => {appointmentORM(s); return Appointment;}