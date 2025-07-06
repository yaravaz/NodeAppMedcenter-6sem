const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Diagnosis = require('./Diagnosis');
const Medication = require('./Medication');

class PrescribedMedication extends Model {}

function prescribedMedicationORM(sequelize){
  PrescribedMedication.init({
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
    Medication_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Medications',
        key: 'ID',
      },
    },
    Dosage: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'PrescribedMedication',
    tableName: 'Prescribed_Medications',
    timestamps: false,
  });
}

exports.ORM = (s) => {prescribedMedicationORM(s); return PrescribedMedication;}