const Router = require('express');
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const uploadCourseImage = require('../utils/uploadPhoto');

const router = new Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/doctors', uploadCourseImage.single('Photo'), AdminController.addDoctor);
router.put('/doctors/:id', uploadCourseImage.single('Photo'), AdminController.updateDoctor);
router.delete('/doctors/:id', AdminController.deleteDoctor);

router.put('/doctors/:doctorId/schedule', AdminController.updateDoctorSchedule);

router.get('/medicines', AdminController.getMedicines);
router.post('/medicines', AdminController.addMedicine);
router.put('/medicines/:id', AdminController.updateMedicineStatus);
router.put('/medicines/:id/price', AdminController.updateMedicinePrice);
router.delete('/medicines/:id', AdminController.deleteMedicine);

module.exports = router;