const ApiError = require('../exceptions/api-error');
const UserServices = require('../services/userServices');

module.exports = async function (req, res, next) {
    try {
        const userServices = new UserServices();
        const userId = req.user.userDto.id;
        const isAdmin = await userServices.isAdmin(userId);
        if (!isAdmin) {
            return next(ApiError.Forbidden('Доступ запрещен: требуется роль администратора'));
        }
        
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};