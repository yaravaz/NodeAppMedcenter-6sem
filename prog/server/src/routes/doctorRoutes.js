const Router = require('express');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/auth-middleware');
const doctorMiddleware = require('../middlewares/doctor-middleware');

const router = new Router();

router.use(authMiddleware);

router.get('/doctor/:id', DoctorController.getDoctorByUserId);
router.get('/appointments/:id', DoctorController.getDoctorAppointments);
router.get('/patient/:id', DoctorController.getPatient);
//router.put('/appointments/:id/status', DoctorController.updateAppointmentStatus);

router.put('/patients/:id/record', doctorMiddleware, DoctorController.updatePatientRecord);

router.get('/profile', doctorMiddleware, DoctorController.getProfile);
router.put('/profile', doctorMiddleware, DoctorController.updateProfile);

module.exports = router;