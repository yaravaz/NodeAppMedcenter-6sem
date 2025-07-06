const { MedicalResult, Diagnosis, Disease, DiagnosedDisease, Medication, PrescribedMedication } = require('../config/database');
const ApiError = require('../exceptions/api-error');

class MedicalService {
    async getDiseases() {
        const diseases = await Disease.findAll({
            attributes: ['ID', 'Name'],
            order: [['Name', 'ASC']]
        });
        return diseases;
    }

    async getMedications() {
        const medications = await Medication.findAll({
            attributes: ['ID', 'IGN', 'Dosage_Form', 'Pharm_Subgroup'],
            where: { isAvailable: true },
            order: [['IGN', 'ASC']]
        });
        return medications;
    }

    async getPatientMedicalResults(patientId) {
        const results = await MedicalResult.findAll({
            where: { Patient_ID: patientId }
        });
        return results;
    }

    async createMedicalResult(patientId, description, diseases, medications, doctorId) {
        try {
            const now = new Date();

            const medicalResult = await MedicalResult.create({
                Patient_ID: patientId,
                Doctor_ID: doctorId, 
                Result_Description: description,
                Date: now
            });


            let diagnosis = null;
            if (diseases && diseases.length > 0) {
                diagnosis = await Diagnosis.create({
                    Patient_ID: patientId,
                    Doctor_ID: doctorId,
                    Date: now
                });

                console.log(diagnosis)

                await DiagnosedDisease.bulkCreate(
                    diseases.map(diseaseId => ({
                        Diagnosis_ID: diagnosis.ID,
                        Disease_ID: diseaseId
                    }))
                );
            }

            if (medications && medications.length > 0) {
                if (!diagnosis) {
                    diagnosis = await Diagnosis.create({
                        Patient_ID: patientId,
                        Doctor_ID: doctorId,
                        Date: now
                    });
                }

                await PrescribedMedication.bulkCreate(
                    medications.map(med => ({
                        Diagnosis_ID: diagnosis.ID,
                        Medication_ID: med.medicationId,
                        Dosage: med.dosage,
                        Duration: med.duration
                    })), {
                        fields: ['ID', 'Diagnosis_ID', 'Medication_ID', 'Dosage', 'Duration']
                    }
                );
            }

            return medicalResult;
        } catch (error) {
            console.error('Detailed error:', error);
            throw ApiError.BadRequest('Ошибка при создании медицинского результата: ' + error.message);
        }
    }

    async createDiagnosis(patientId, diseaseIds, notes, doctorId) {
        try {
            const diagnosis = await Diagnosis.create({
                Patient_ID: patientId,
                Doctor_ID: doctorId,
                Date: new Date()
            });

            if (diseaseIds && diseaseIds.length > 0) {
                await DiagnosedDisease.bulkCreate(
                    diseaseIds.map(diseaseId => ({
                        Diagnosis_ID: diagnosis.ID,
                        Disease_ID: diseaseId
                    }))
                );
            }

            return diagnosis;
        } catch (error) {
            throw ApiError.BadRequest('Ошибка при создании диагноза: ' + error.message);
        }
    }

    async prescribeMedication(diagnosisId, medicationId, dosage, duration) {
        try {
            const prescription = await PrescribedMedication.create({
                Diagnosis_ID: diagnosisId,
                Medication_ID: medicationId,
                Dosage: dosage,
                Duration: duration
            });
            return prescription;
        } catch (error) {
            throw ApiError.BadRequest('Ошибка при назначении лекарства: ' + error.message);
        }
    }

    async getPatientDiagnoses(patientId) {
        const diagnoses = await Diagnosis.findAll({
            where: { Patient_ID: patientId },
            include: [{
                model: Disease,
                through: { attributes: [] },
                attributes: ['ID', 'Name']
            }],
            order: [['Date', 'DESC']]
        });
        return diagnoses;
    }

    async getPatientDiagnosisData(patientId) {
      const diagnoses = await Diagnosis.findAll({
        where: { Patient_ID: patientId },
        include: [
          {
            model: DiagnosedDisease,
            include: [Disease]
          },
          {
            model: PrescribedMedication,
            include: [Medication]
          }
        ],
        order: [['Date', 'DESC']]
      });
    
      return diagnoses.map(diagnosis => ({
        id: diagnosis.ID,
        date: diagnosis.Date,
        doctorId: diagnosis.Doctor_ID,
        diseases: diagnosis.DiagnosedDiseases?.map(dd => ({
          id: dd.Disease?.ID,
          name: dd.Disease?.Name
        })) || [],
        medications: diagnosis.PrescribedMedications?.map(pm => ({
          id: pm.Medication?.ID,
          name: pm.Medication?.IGN,
          form: pm.Medication?.Dosage_Form,
          dosage: pm.Dosage,
          duration: pm.Duration
        })) || []
      }));
    }
}

module.exports = MedicalService;