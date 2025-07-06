const ApiError = require('../exceptions/api-error');
const UserServices = require('../services/userServices');

const userServices = new UserServices();

module.exports = async function (req, res, next) {
    try {
        const userId = req.user.userDto.id;
        const isDoctor = await userServices.isDoctor(userId);
        
        if (!isDoctor) {
            return next(ApiError.Forbidden('Доступ запрещен: требуется роль врача'));
        }
        
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};