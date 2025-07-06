const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Diseases extends Model {}

function diagnosisORM(sequelize){
  Diseases.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Disease',
    tableName: 'Diseases',
    timestamps: false,
  });
}

exports.ORM = (s) => {diagnosisORM(s); return Diseases;}