let UserServices = require('../services/userServices');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error')

let userServices = new UserServices();

class UserController {

    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
            }
            const {login, password} = req.body;  
            const userData = await userServices.registration(login, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            return res.json(userData);
        } catch (e){
            next(e);
        }
    }

    async login(req, res, next) {
        try{
            const {login, password, role} = req.body;
            const userData = await userServices.login(login, password, role);
            if (!userData.refreshToken) {
                return res.json(userData);
            }
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e){
            next(e);
        }
    }

    async logout(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const token = await userServices.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token); 
        } catch (e){
            next(e);
        }
    }

    async refresh(req, res, next) {
        try{
            console.log(req.cookies);
            const {refreshToken} = req.cookies;
            const userData = await userServices.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e){
            next(e);
        }
    }

    async getUserData(req, res, next) {
        const { id } = req.user.userDto;
        try {
            const userData = await userServices.getUserData(id);
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res) {
        const {id} = req.params;
        try {
            const user = await userServices.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try{
            const { id } = req.user.userDto;
            await userServices.deleteUser(id);
            res.clearCookie('refreshToken');

            return res.status(204).send();
        } catch (e){
            next(e);
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userServices.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async insertUser(req, res) {
        const {login, password} = req.body;
        try {
            const user = await userServices.insertUser(login, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUsername(req, res) {
        try {
            const { username, userId } = req.body;
            const updatedUser = await userServices.updateUsername(userId, username);
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = new UserController();