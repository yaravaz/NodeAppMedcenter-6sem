const { Doctor, Appointment, Patient, User, Schedule } = require('../config/database');
const DoctorDto = require('../dtos/doctorDto');
const PatientDto = require('../dtos/patientDto');
const UserDto = require('../dtos/userDto');
const {generateLogin, generatePassword} = require('../utils/userUtils')
const bcrypt = require('bcrypt'); 
const cloudinary = require('../config/cloudinary.js');

class DoctorServices {

    addDoctor = async (data) => {
        try {
            const login = generateLogin(data.First_Name, data.Last_Name);
            const password = generatePassword();
            const hashPassword = await bcrypt.hash(password, 3);
            
            const candidate = await User.findOne({ 
                where: { Login: login }
            });
            if (candidate) {
                throw ApiError.BadRequest(`Пользователь с логином ${login} уже существует`);
            }
            
            const user = await User.create({ 
                Login: login, 
                Password: hashPassword, 
                Role: 'doctor' 
            });

            const doctor = await Doctor.create({
                First_Name: data.First_Name,
                Last_Name: data.Last_Name,
                Patronymic: data.Patronymic,
                Birthdate: data.Birthdate,
                Phone: data.Phone,
                Specialization: data.Specialization,
                Category: data.Category,
                Photo: data.Photo,
                User_ID: user.ID
            });

            const schedulesToCreate = Array.isArray(data.Schedule) 
            ? data.Schedule 
            : JSON.parse(data.Schedule || '[]');

            if (schedulesToCreate.length > 0) {
                await Promise.all(
                    schedulesToCreate.map(schedule => 
                        Schedule.create({
                            Doctor_ID: doctor.ID,
                            Day_of_week: schedule.day_of_week,
                            Start_time: schedule.start_time,
                            End_time: schedule.end_time,
                            Interval: schedule.interval
                        })
                    )
                );
            }

            
            const doctorWithSchedule = await Doctor.findByPk(doctor.ID, {
                include: {
                    model: Schedule,
                    as: 'Schedules'
                }
            });
            
            return { 
                doctor: new DoctorDto(doctorWithSchedule), 
                credentials: { login, password } 
            };
        } catch (error) {
            if (data.Photo && data.Photo.includes('cloudinary')) {
                const publicId = data.Photo.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`doctors/${publicId}`);
            }
            throw error;
        }
    }

    updateDoctor = async (id, updates, oldPhotoPublicId) => {
        try {
            const doctor = await Doctor.findByPk(id);
            if (!doctor) throw ApiError.BadRequest('Doctor not found');
        
            if (updates.Photo && oldPhotoPublicId) {
                try {
                    await cloudinary.uploader.destroy(oldPhotoPublicId);
                } catch (e) {
                    console.error('Error deleting old photo:', e);
                }
            }
            
            await doctor.update(updates);
            
            await Schedule.destroy({ 
                where: { Doctor_ID: id }
            });

            const schedulesToCreate = Array.isArray(updates.Schedule) 
            ? updates.Schedule 
            : JSON.parse(updates.Schedule || '[]');
            
            if (schedulesToCreate.length > 0) {
                await Promise.all(
                    schedulesToCreate.map(schedule => 
                        Schedule.create({
                            Doctor_ID: id,
                            Day_of_week: schedule.day_of_week,
                            Start_time: schedule.start_time,
                            End_time: schedule.end_time,
                            Interval: schedule.interval
                        })
                    )
                );
            }
            
            const updatedDoctor = await Doctor.findByPk(id, { 
                include: {
                    model: Schedule,
                    as: 'Schedules'
                }
            });
            
            return new DoctorDto(updatedDoctor);
        } catch (error) {
            if (updates.Photo && updates.Photo.includes('cloudinary')) {
                const publicId = updates.Photo.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`doctors/${publicId}`);
            }
            throw error;
        }
    }

    deleteDoctor = async (id) => {
        const doctor = await Doctor.findByPk(id);
        if (!doctor) throw new Error('Doctor not found');

        await User.destroy({ where: { ID: doctor.User_ID } });
        await Doctor.destroy({ where: { ID: id } });
        
        return { success: true };
    }

    getAllDoctors = async () => {
        const doctors = await Doctor.findAll({
        include: {
          model: Schedule,
          as: 'Schedules'
        }
        });
        return doctors.map(doctor => new DoctorDto(doctor));
    }

    getDoctorById = async (id) => {
        const doctor = await Doctor.findByPk(id, {
        include: {
            model: Schedule,
            as: 'Schedules' 
        }});
        if (!doctor) throw new Error('Doctor not found');
        return new DoctorDto(doctor);
    }

    getDoctorByUserId = async (userId) => {
        const doctor = await Doctor.findOne({ 
            where: { User_ID: userId },
            include: {
                model: Schedule,
                as: 'Schedules'
            }
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return new DoctorDto(doctor);
    };

    getDoctorAppointments = async (doctorId) => {
        const appointments = await Appointment.findAll({
            where: { Doctor_ID: doctorId },
            include: [{
                model: Patient,
                as: 'Patient',
            }]
        });

        return {
            appointments,
            patients: appointments.map(a => new PatientDto(a.Patient))
        };
    };

    updateDoctorSchedule = async (doctorId, schedules) => {
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            throw ApiError.BadRequest('Врач не найден');
        }
        
        await Schedule.destroy({
            where: { Doctor_ID: doctorId }
        });
        
        const createdSchedules = await Promise.all(
            schedules.map(schedule => 
                Schedule.create({
                    Doctor_ID: doctorId,
                    Day_of_week: schedule.day_of_week,
                    Start_time: schedule.start_time,
                    End_time: schedule.end_time,
                    Interval: schedule.interval
                })
            )
        );
        return createdSchedules;
    }

    updateDoctorInfo = async (doctorId, updates) => {
        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        
        await doctor.update(updates);
        return new DoctorDto(doctor);
    };

    // getDoctorPatients = async (doctorId) => {
    //     try {
    //         const doctor = await Doctor.findByPk(doctorId);
    //         if (!doctor) {
    //             throw new Error('Doctor not found');
    //         }

    //         const appointments = await Appointment.findAll({
    //             where: { Doctor_ID: doctorId },
    //             include: [{
    //                 model: Patient,
    //                 as: 'Patient',
    //                 required: true
    //             }]
    //         });

    //         if (!appointments || appointments.length === 0) {
    //             return []; 
    //         }

    //         const uniquePatients = [];
    //         const patientIds = new Set();

    //         appointments.forEach(appointment => {
    //             if (appointment.Patient && !patientIds.has(appointment.Patient.ID)) {
    //                 patientIds.add(appointment.Patient.ID);
    //                 uniquePatients.push(appointment.Patient);
    //             }
    //         });

    //         return uniquePatients.map(patient => ({
    //             id: patient.ID,
    //             firstName: patient.First_Name,
    //             lastName: patient.Last_Name,
    //             patronymic: patient.Patronymic,
    //             birthdate: patient.Birthdate,
    //             gender: patient.Gender,
    //             phone: patient.Phone,
    //             userId: patient.User_ID
    //         }));
            
    //     } catch (error) {
    //         console.error('Error in getDoctorPatients:', error);
    //         throw error;
    //     }
    // };

}

module.exports = DoctorServices;