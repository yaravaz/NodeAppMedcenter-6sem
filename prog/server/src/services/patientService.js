const { connection, Patient } = require('../config/database');
const PatientDto = require('../dtos/patientDto');

class PatientServices {
    getPatients = async () => {
        const patients = await Patient.findAll();
        return patients.map(patient => new PatientDto(patient));
    }

    getPatientById = async (id) => {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return new PatientDto(patient);
    };

    insertPatient = async (data) => {
        const patient = await Patient.create(data);
        return new PatientDto(patient);
    };

    updatePatient = async (id, updates) => {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            throw new Error('Patient not found');
        }
        
        await Patient.update(updates, { where: { ID: id } });
        const updatedPatient = await Patient.findByPk(id);
        return new PatientDto(updatedPatient);
    };

    deletePatient = async (id) => {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            throw new Error('Patient not found');
        }
        
        await Patient.destroy({ where: { ID: id } });
        return {success: true};
    };

    getPatientDetails = async (patientId) => {
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return new PatientDto(patient);
    };

    updatePatientMedicalInfo = async (patientId, updates) => {
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        
        await patient.update(updates);
        return new PatientDto(patient);
    };

}

module.exports = PatientServices;