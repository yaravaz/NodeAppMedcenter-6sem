const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

class Diagnosis extends Model {}

function diagnosisORM(sequelize){
  Diagnosis.init({
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
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Diagnosis',
    tableName: 'Diagnoses',
    timestamps: false,
  });
}

exports.ORM = (s) => {diagnosisORM(s); return Diagnosis;}