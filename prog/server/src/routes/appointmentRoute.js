const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/auth-middleware');

router.use(authMiddleware);

router.post('/', PatientController.createAppointment);
router.put('/:id/cancel', PatientController.cancelAppointment);
router.get('/patient/:id', PatientController.getPatientAppointments);
router.get('/doctor/:id', DoctorController.getDoctorAppointments);

module.exports = router;