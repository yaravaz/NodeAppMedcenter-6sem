const {Patient} = require('../config/database');
const ApiError = require('../exceptions/api-error');
let AppointmentService = require('../services/appointmentService');

let appointmentService = new AppointmentService();

class PatientController {

  async createEmpty(req, res, next) {
    try {
      const { User_ID } = req.body;

      if (!User_ID) {
        throw ApiError.BadRequest('Не указан ID пользователя');
      }

      const emptyPatient = await Patient.create({
        User_ID,
        First_Name: '',
        Last_Name: '',
        Patronymic: '',
        Birthdate: null,
        Gender: 'М',
        Phone: '',
        isDeleted: false
      });

      res.status(201).json({
        success: true,
        data: emptyPatient
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const patientData = req.body;

      if (!id) {
        throw ApiError.BadRequest('Не указан ID пациента');
      }

      const updatedPatient = await Patient.update(patientData, {
        where: { ID: id },
        returning: true,
        plain: true
      });

      if (!updatedPatient[1]) {
        throw ApiError.NotFound('Пациент не найден');
      }

      res.json({
        success: true,
        data: updatedPatient[1]
      });
    } catch (error) {
      next(error);
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw ApiError.BadRequest('Не указан ID пользователя');
      }

      const patient = await Patient.findOne({
        where: { User_ID: userId }
      });
      if (!patient) {
        throw ApiError.NotFound('Пациент не найден');
      }

      res.json({
        success: true,
        data: patient
      });
    } catch (error) {
      next(error);
    }
  }

  async createAppointment(req, res, next) {
    try {
      const { date } = req.body;
      //const patientId = req.user.id;
      const token = req.headers.authorization;

      const appointment = await appointmentService.createAppointment(
        date, 
        token
      );

      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }

  async cancelAppointment(req, res, next) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization;

      const appointment = await appointmentService.cancelAppointment(
        id, 
        token
      );

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }

  async getPatientAppointments(req, res, next) {
    try {
      const {id} = req.params;
      const token = req.headers.authorization;

      const appointments = await appointmentService.getPatientAppointments(
        id, 
        token
      );

      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new PatientController();