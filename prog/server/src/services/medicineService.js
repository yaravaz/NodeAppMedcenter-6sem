const { Medication } = require('../config/database');
const MedicationDto = require('../dtos/medicationDto');
const ApiError = require('../exceptions/api-error');

class MedicineService {

    async getAllMedicines() {
        const medicines = await Medication.findAll();
        return medicines.map(medicine => new MedicationDto(medicine));
    }

    async getMedicineById(id) {
        const medicine = await Medication.findByPk(id);
        if (!medicine) {
            throw ApiError.BadRequest('Лекарство не найдено');
        }
        return new MedicationDto(medicine);
    }

    async addMedicine(data) {
        const medicine = await Medication.create({
            Pharm_Subgroup: data.Pharm_Subgroup,
            IGN: data.IGN,
            Dosage_Form: data.Dosage_Form,
            Price: data.Price,
            isAvailable: data.isAvailable
        });
        return new MedicationDto(medicine);
    }

    async updateMedicineStatus(id, isAvailable) {
        const medicine = await Medication.findByPk(id);
        if (!medicine) {
            throw ApiError.BadRequest('Лекарство не найдено');
        }
        await medicine.update({isAvailable: isAvailable});
        return new MedicationDto(medicine);
    }

    async updateMedicinePrice(id, price) {
        const medicine = await Medication.findByPk(id);
        if (!medicine) {
            throw ApiError.BadRequest('Лекарство не найдено');
        }
        await medicine.update({ Price: price }); 
        return new MedicationDto(medicine);
    }

    async deleteMedicine(id) {
        const medicine = await Medication.findByPk(id);
        if (!medicine) {
            throw ApiError.BadRequest('Лекарство не найдено');
        }
        await medicine.destroy();
        return { message: 'Лекарство успешно удалено' };
    }
}

module.exports = MedicineService;