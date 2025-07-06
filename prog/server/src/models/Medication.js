const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Medication extends Model {}

function medicationORM(sequelize){
  Medication.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Pharm_Subgroup: {
      type: DataTypes.STRING(250),
      unique: false,
      allowNull: false,
    },
    IGN: {
      type: DataTypes.STRING(200),
      unique: false,
      allowNull: false,
    },
    Dosage_Form: {
      type: DataTypes.STRING(200),
      unique: false,
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Medication',
    tableName: 'Medications',
    timestamps: false,
  });
}

exports.ORM = (s) => {medicationORM(s); return Medication;}