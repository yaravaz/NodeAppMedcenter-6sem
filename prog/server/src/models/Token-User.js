const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TokenUser extends Model {}

function tokenUserORM(sequelize){
  TokenUser.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    User_ID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'ID',
        },
      },
    RefreshToken: {
      type: DataTypes.STRING(300),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TokenUser',
    tableName: 'TokenUsers',
    timestamps: false,
  });
}

exports.ORM = (s) => {tokenUserORM(s); return TokenUser;}