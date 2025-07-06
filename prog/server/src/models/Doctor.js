const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Doctor extends Model {}

function doctorORM(sequelize){
  Doctor.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    First_Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Last_Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Patronymic: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Birthdate: {
      type: DataTypes.DATEONLY(50),
      allowNull: false
    },
    Phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    Specialization: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Photo: {
      type: DataTypes.STRING(255), 
      allowNull: false,
      defaultValue: null
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
    modelName: 'Doctor',
    tableName: 'Doctors',
    timestamps: false,
  });  
}

exports.ORM = (s) => {doctorORM(s); return Doctor;}