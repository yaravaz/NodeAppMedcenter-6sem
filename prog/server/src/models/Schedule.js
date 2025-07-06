const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');

class Schedule extends Model {}

function scheduleORM(sequelize) {
  Schedule.init({
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true
    },
    Doctor_ID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Doctors',
        key: 'ID',
      },
    },
    Day_of_week: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']],
      }
    },
    Start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    End_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Interval: {
      type: DataTypes.TIME,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'Schedules',
    timestamps: false,
  });
}

exports.ORM = (s) => {scheduleORM(s); return Schedule;}