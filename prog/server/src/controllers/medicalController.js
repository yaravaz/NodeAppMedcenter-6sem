const ApiError = require('../exceptions/api-error');
const MedicalService = require('../services/medicalService');
const DoctorServices = require('../services/doctorService');

const medicalService = new MedicalService();
const doctorService = new DoctorServices();

class MedicalController {
    async getDiseases(req, res, next) {
        try {
            const diseases = await medicalService.getDiseases();
            res.json({
                success: true,
                data: diseases
            });
        } catch (e) {
            next(e);
        }
    }

    async getMedications(req, res, next) {
        try {
            const medications = await medicalService.getMedications();
            res.json({
                success: true,
                data: medications
            });
        } catch (e) {
            next(e);
        }
    }

    async getPatientMedicalResults(req, res, next) {
        try {
            const { id } = req.params;
            const results = await medicalService.getPatientMedicalResults(id);
            res.json({
                success: true,
                data: results
            });
        } catch (e) {
            next(e);
        }
    }

    async createMedicalResult(req, res, next) {
        try {
            const { patientId, description, diseases, medications } = req.body;
            const doctor = await doctorService.getDoctorByUserId(req.user.userDto.id);
            const result = await medicalService.createMedicalResult(
                patientId, 
                description, 
                diseases, 
                medications,
                doctor.id
            );
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (e) {
            next(e);
        }
    }

    async createDiagnosis(req, res, next) {
        try {
            const { patientId, diseaseIds, notes } = req.body;
            const diagnosis = await medicalService.createDiagnosis(
                patientId, 
                diseaseIds, 
                notes
            );
            res.status(201).json({
                success: true,
                data: diagnosis
            });
        } catch (e) {
            next(e);
        }
    }

    async prescribeMedication(req, res, next) {
        try {
            const { diagnosisId, medicationId, dosage, duration } = req.body;
            const prescription = await medicalService.prescribeMedication(
                diagnosisId, 
                medicationId, 
                dosage, 
                duration
            );
            res.status(201).json({
                success: true,
                data: prescription
            });
        } catch (e) {
            next(e);
        }
    }

    async getPatientDiagnoses(req, res, next) {
        try {
            const { id } = req.params;
            const diagnoses = await medicalService.getPatientDiagnoses(id);
            res.json({
                success: true,
                data: diagnoses
            });
        } catch (e) {
            next(e);
        }
    }

    async getPatientDiagnosisData(req, res, next) {
      try {
        const { id } = req.params;
        console.log(id)
        const data = await medicalService.getPatientDiagnosisData(id);
        res.json({
          success: true,
          data
        });
      } catch (e) {
        next(e);
      }
    }

}

module.exports = new MedicalController();