const ApiError = require('../exceptions/api-error')
const TokenService = require('../services/tokenService');

let tokenService = new TokenService();

module.exports = async function(req, res, next){
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError());
        }
        
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnauthorizedError());
        }

        const userData = await tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError('JWT expired'));
        }
        req.user = userData;
        next();
    }catch(e){
        return next(ApiError.UnauthorizedError());
    }
}