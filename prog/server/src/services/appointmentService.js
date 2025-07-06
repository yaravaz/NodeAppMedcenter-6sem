const {Appointment, Doctor, Schedule} = require('../config/database');
let DoctorServices = require('../services/doctorService');
const AppointmentDto = require('../dtos/appointmentDto');
const { Op } = require('sequelize');

const doctorServices = new DoctorServices();

class AppointmentService {

async createAppointment(date, token) {
  try {
    const { patientId, doctorId, appointmentData } = date;
    const newAppointmentTime = new Date(appointmentData);
    
    const doctor = await doctorServices.getDoctorById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const appointmentDayName = dayNames[newAppointmentTime.getDay()];
    const doctorSchedule = doctor.schedule.find(s => s.day_of_week === appointmentDayName);
    
    if (!doctorSchedule) {
      throw new Error('Врач не принимает в выбранный день');
    }
    
    const [intervalHours, intervalMinutes] = doctorSchedule.interval.split(':').map(Number);
    const APPOINTMENT_DURATION = intervalHours * 60 + intervalMinutes;
    const appointmentEnd = new Date(newAppointmentTime.getTime() + APPOINTMENT_DURATION * 60000);

    const patientAppointments = await Appointment.findAll({
      where: {
        Patient_ID: patientId,
        isDenied: false,
        Appointment_Date: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      include: [{
        model: Doctor,
        as: 'Doctor',
        include: [{
          model: Schedule,
          as: 'Schedules'
        }]
      }]
    });

    for (const existing of patientAppointments) {
      const existingDayName = dayNames[new Date(existing.Appointment_Date).getDay()];
      const existingSchedule = existing.Doctor.Schedules.find(s => s.Day_of_week === existingDayName);
      
      if (existingSchedule) {
        const [existingHours, existingMinutes] = existingSchedule.Interval.split(':').map(Number);
        const existingDuration = existingHours * 60 + existingMinutes;
        const existingEnd = new Date(new Date(existing.Appointment_Date).getTime() + existingDuration * 60000);
        
        const isConflict = (
          (newAppointmentTime >= new Date(existing.Appointment_Date) && newAppointmentTime < existingEnd) ||
          (appointmentEnd > new Date(existing.Appointment_Date) && appointmentEnd <= existingEnd) ||
          (newAppointmentTime <= new Date(existing.Appointment_Date) && appointmentEnd >= existingEnd)
        );
        
        if (isConflict) {
          const conflictTime = new Date(existing.Appointment_Date).toLocaleString();
          throw new Error(`У вас уже есть запись на ${conflictTime}, которая пересекается с выбранным временем`);
        }
      }
    }
    
    const appointment = await Appointment.create({
      Patient_ID: patientId,
      Doctor_ID: doctorId,
      Appointment_Date: newAppointmentTime,
      isDenied: false
    });
    
    return new AppointmentDto(appointment);
  } catch (error) {
    console.error('Error in createAppointment:', error);
    throw error;
  }
  }

  async cancelAppointment(appointmentId, token) {
    try {
      const appointment = await Appointment.findByPk(appointmentId);
      
      if (!appointment) {
        throw new Error('Запись не найдена');
      }

      appointment.isDenied = true;
      await appointment.save();

      return new AppointmentDto(appointment);
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      throw error;
    }
  }

  async getPatientAppointments(patientId, token) {
    try {
      const appointments = await Appointment.findAll({
        where: { Patient_ID: patientId},
        order: [['Appointment_Date', 'ASC']]
      });

      return appointments.map(app => new AppointmentDto(app));
    } catch (error) {
      console.error('Error in getPatientAppointments:', error);
      throw error;
    }
  }

  async getDoctorAppointments(doctorId) {
    try {
      const appointments = await Appointment.findAll({
        where: { Doctor_ID: doctorId }
      });

      console.log(appointments);

      return appointments.map(app => new AppointmentDto(app));
    } catch (error) {
      console.error('Error in getDoctorAppointments:', error);
      throw error;
    }
  }
}

module.exports = AppointmentService;