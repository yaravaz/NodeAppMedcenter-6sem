const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

function userORM(sequelize){
  User.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Login: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Role: {
      type:DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [['admin', 'doctor', 'client']],
      }
    },
    Registration_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: false,
  });
}

exports.ORM = (s) => {userORM(s); return User;}