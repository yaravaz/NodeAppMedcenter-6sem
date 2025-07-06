const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

class DiagnosedDisease extends Model {}

function diagnosedDiseaseORM(sequelize){
  DiagnosedDisease.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Diagnosis_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Diagnoses',
        key: 'ID',
      },
    },
    Disease_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Diseases',
        key: 'ID',
      },
    },
  }, {
    sequelize,
    modelName: 'DiagnosedDisease',
    tableName: 'DiagnosedDiseases',
    timestamps: false,
  });
}

exports.ORM = (s) => {diagnosedDiseaseORM(s); return DiagnosedDisease;}