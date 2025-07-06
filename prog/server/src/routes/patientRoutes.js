const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const patientController = require('../controllers/patientController');
const adminMiddleware = require('../middlewares/admin-middleware');

const router = express.Router();

router.post('/empty', authMiddleware, patientController.createEmpty);
router.put('/:id', authMiddleware, patientController.update);

router.get('/user/:userId', authMiddleware, patientController.getByUserId);

//router.get('/', authMiddleware, adminMiddleware, patientController.getAll);
//router.delete('/:id', authMiddleware, adminMiddleware, patientController.delete);

module.exports = router;