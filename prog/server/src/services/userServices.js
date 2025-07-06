const {connection, User, Patient} = require('../config/database');
const bcrypt = require('bcrypt'); 
const TokenService = require('../services/tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/api-error')

let tokenService = new TokenService();

class UserServices {

    registration = async(login, password) => {
        const candidate = await User.findOne({where: {Login:login}});
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с логином ${login} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({Login:login, Password: hashPassword, Role: 'client'});
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    login = async(login, password) => {
        const user = await User.findOne({where: {Login: login}});
        if(!user){
            throw ApiError.BadRequest('Пользователь с таким логином не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.Password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    logout = async(refreshToken) => {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    
    refresh = async(refreshToken) => {
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    getUserData = async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    getUserById = async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return new UserDto(user);
    };

    insertUser = async (login, password) => {
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({Login: login, Password: hashPassword});
        return new UserDto(user);
    };
    
    updateUsername = async (id, username) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        
        const existingUser = await User.findOne({ where: { Login: username } });
        if (existingUser && existingUser.ID !== id) {
            throw new Error('Этот логин уже занят');
        }
        
        const [updated] = await User.update(
            { Login: username },
            { where: { ID: id } }
        );
        
        if (!updated) {
            throw new Error('Не удалось обновить логин');
        }
        
        const updatedUser = await User.findByPk(id);
        return new UserDto(updatedUser);
    };

    deleteUser = async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        const patient = await Patient.findOne({where: {User_ID: id}});
        if (patient) {
            await patient.update({User_ID: null});
        }

        await User.destroy({where: {ID: id}});
        return new UserDto(user);
    };

    isAdmin = async (userId) => {
        const user = await User.findByPk(userId);
        return user?.Role === 'admin';
    };
    
    isDoctor = async (userId) => {
        const user = await User.findByPk(userId);
        return user?.Role === 'doctor';
    };
    
}

module.exports = UserServices;