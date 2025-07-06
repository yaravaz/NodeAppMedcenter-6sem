let DoctorServices = require('../services/doctorService');
let AppointmentService = require('../services/appointmentService');
const ApiError = require('../exceptions/api-error');
const PatientServices = require('../services/patientService');

class DoctorController {
    constructor() {
        this.doctorService = new DoctorServices();
        this.appointmentService = new AppointmentService();
        this.patientService = new PatientServices();
    }

    getDoctorByUserId = async (req, res, next) => {
       try {
           const userId = await req.user.userDto.id;
           const doctor = await this.doctorService.getDoctorByUserId(userId);
           res.json(doctor);
       } catch (e) {
           next(ApiError.BadRequest(e.message));
       }
    };

    //getAppointments = async (req, res, next) => {
    //   try {
    //       const doctorId = await req.user.doctorId;
    //       const appointments = await this.doctorService.getDoctorAppointments(doctorId);
    //       res.json(appointments);
    //   } catch (e) {
    //       next(ApiError.BadRequest(e.message));
    //   }
    //};

    getDoctorAppointments = async (req, res, next) => {
        try {
          const {id} = req.params;
    
          const {appointments, patients} = await this.doctorService.getDoctorAppointments(id);

          console.log(appointments);
          console.log(patients);
    
          res.json({appointments, patients});
        } catch (error) {
          console.error(error);
          res.status(400).json({ message: error.message });
        }
      }

    //updateAppointmentStatus = async (req, res, next) => {
    //    try {
    //        const { id } = req.params;
    //        const { status } = req.body;
    //        const result = await this.doctorService.updateAppointmentStatus(id, status);
    //        res.json(result);
    //    } catch (e) {
    //        next(ApiError.BadRequest(e.message));
    //    }
    //};

    getPatient = async (req, res, next) => {
       try {
           const { id } = req.params;
           const patient = await this.patientService.getPatientById(id);
           res.json(patient);
       } catch (e) {
           next(ApiError.BadRequest(e.message));
       }
    };

    //getPatientDetails = async (req, res, next) => {
    //    try {
    //        const { id } = req.params;
    //        const patient = await this.doctorService.getPatientDetails(id);
    //        res.json(patient);
    //    } catch (e) {
    //        next(ApiError.NotFound(e.message));
    //    }
    //};

    updatePatientRecord = async (req, res, next) => {
        try {
            const { id } = req.params;
            const patient = await this.doctorService.updatePatientRecord(id, req.body);
            res.json(patient);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    };

    getProfile = async (req, res, next) => {
        try {
            const doctorId = await req.user.doctorId;
            const profile = await this.doctorService.getDoctorProfile(doctorId);
            res.json(profile);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const doctorId = await req.user.doctorId;
            const profile = await this.doctorService.updateDoctorProfile(doctorId, req.body);
            res.json(profile);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    };
}

module.exports = new DoctorController();