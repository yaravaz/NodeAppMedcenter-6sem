const Router = require('express');
const MedicalController = require('../controllers/medicalController');
const authMiddleware = require('../middlewares/auth-middleware');
const doctorMiddleware = require('../middlewares/doctor-middleware');

const router = new Router();

router.use(authMiddleware);

router.get('/diseases', doctorMiddleware, MedicalController.getDiseases);
router.get('/medications', MedicalController.getMedications);
router.get('/results/patient/:id', MedicalController.getPatientMedicalResults);
router.post('/results', doctorMiddleware, MedicalController.createMedicalResult);
router.post('/diagnoses', doctorMiddleware, MedicalController.createDiagnosis);
router.post('/prescriptions', doctorMiddleware, MedicalController.prescribeMedication);
router.post('/diagnoses/patient/:id', doctorMiddleware, MedicalController.getPatientDiagnoses);
router.get('/patients/:id/diagnosis-data', MedicalController.getPatientDiagnosisData);

module.exports = router;