const express = require('express');
const userController = require('../controllers/userController');
const AdminController = require('../controllers/adminController');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router();


router.post('/registration', 
    body('login').isLength({min:5, max:30}),
    body('password').isLength({min:7, max:33}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

router.get('/doctors', AdminController.getDoctors);
router.get('/doctors/:id', AdminController.getDoctor);

router.get('/me', authMiddleware, userController.getUserData);
router.delete('/me', authMiddleware, userController.deleteUser);
router.patch('/me/username', authMiddleware, userController.updateUsername);

//router.post('/', userController.insertUser);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);


module.exports = router;