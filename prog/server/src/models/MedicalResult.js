const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

class MedicalResult extends Model {}

function medicalResultORM(sequelize){
  MedicalResult.init({
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
    Result_Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'MedicalResult',
    tableName: 'Medical_Results',
    timestamps: false,
  });
}

exports.ORM = (s) => {medicalResultORM(s); return MedicalResult;}