const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs');
const { sequelize, Medication, Disease } = require('./config/database');

async function loadMedicationsFromJSON() {
  try {
    await sequelize.sync();
    console.log('База данных синхронизирована!');

    let jsonData = fs.readFileSync('src/medications.json', 'utf8');
    const medications = JSON.parse(jsonData);

    for (const item of medications) {
      await Medication.create(item);
    }

    jsonData = fs.readFileSync('src/diseases.json', 'utf8');
    const diseases = JSON.parse(jsonData);

    for (const item of diseases) {
      await Disease.create(item);
    }


    console.log('Данные успешно добавлены в таблицы Medications и Disease.');
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error);
  } finally {
    await sequelize.close();
  }
}

module.exports = {loadMedicationsFromJSON}