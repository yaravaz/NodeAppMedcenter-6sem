const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Patient extends Model {}

function patientORM(sequelize){
  Patient.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      
    },
    First_Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Last_Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Patronymic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    Gender: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'М',
      validate: {
        isIn: [['М', 'Ж']],
      }
    },
    Phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    User_ID: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID',
      },
    },
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients',
    timestamps: false,
  });
}

exports.ORM = (s) => {patientORM(s); return Patient;}