const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {}

function categoryORM(sequelize){
  Category.init({
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
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: false,
  });
}

exports.ORM = (s) => {categoryORM(s); return Category;}