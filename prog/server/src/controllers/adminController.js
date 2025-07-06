const DoctorService = require('../services/doctorService');
const MedicineService = require('../services/medicineService');
const UserServices = require('../services/userServices');
const ApiError = require('../exceptions/api-error');

const doctorServices = new DoctorService();
const medicineService = new MedicineService();

class AdminController {
    async addDoctor(req, res, next) {
        try {
            const doctorData = {
                ...req.body,
                Photo: req.file?.path,
                Schedule: req.body.schedule ? JSON.parse(req.body.schedule) : []
            };

            const result = await doctorServices.addDoctor(doctorData);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateDoctor(req, res, next) {
        try {
            const doctorData = {
                ...req.body,
                Photo: req.file?.path
            };
            console.log(doctorData);

            const doctor = await doctorServices.updateDoctor(
                req.params.id, 
                doctorData,
                req.file?.path 
            );
            res.json(doctor);
        } catch (e) {
            next(e);
        }
    }

    async deleteDoctor(req, res, next) {
        try {
            const result = await doctorServices.deleteDoctor(req.params.id);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getDoctors(req, res, next) {
        try {
            const doctors = await doctorServices.getAllDoctors();
            res.json(doctors);
        } catch (e) {
            next(e);
        }
    }

    async getDoctor(req, res, next) {
        try {
            const doctor = await doctorServices.getDoctorById(req.params.id);
            res.json(doctor);
        } catch (e) {
            next(e);
        }
    }

    async updateDoctorSchedule(req, res, next) {
        try {
            const { doctorId } = req.params;
            const schedules = req.body.schedules;
            const result = await doctorServices.updateDoctorSchedule(doctorId, schedules);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }

    // Лекарства

    async getMedicines(req, res, next) {
        try {
            const medicines = await medicineService.getAllMedicines();
            return res.json(medicines);
        } catch (e) {
            next(e);
        }
    }

    async addMedicine(req, res, next) {
        try {
            const data  = req.body;
            const medicine = await medicineService.addMedicine(data);
            return res.json(medicine);
        } catch (e) {
            next(e);
        }
    }

    async updateMedicineStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { isAvailable } = req.body;
            const medicine = await medicineService.updateMedicineStatus(id, isAvailable);
            return res.json(medicine);
        } catch (e) {
            next(e);
        }
    }

    async updateMedicinePrice(req, res, next) {
        try {
            const { id } = req.params;
            const { price } = req.body;
            const medicine = await medicineService.updateMedicinePrice(id, price);
            return res.json(medicine);
        } catch (e) {
            next(e);
        }
    }

    async deleteMedicine(req, res, next) {
        try {
            const { id } = req.params;
            const result = await medicineService.deleteMedicine(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new AdminController();