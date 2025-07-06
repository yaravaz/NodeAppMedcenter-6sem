const jwt = require('jsonwebtoken');
const {TokenUser} = require('../config/database');

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return{
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await TokenUser.findOne({where: {User_ID: userId}});
        if(tokenData){
            tokenData.dataValues.RefreshToken = refreshToken;
            return await TokenUser.update({RefreshToken:refreshToken}, {where:{User_ID: userId}})
        }
        const token = await TokenUser.create({User_ID:userId, RefreshToken:refreshToken});
        return token;
    }

    async removeToken(refreshToken){
        console.log(refreshToken);
        const tokenData = await TokenUser.destroy({where:{RefreshToken:refreshToken}});
        return tokenData;
    }

    async validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    }

    async validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET).userDto;
            return userData;
        }catch(e){
            return null;
        }
    }

    async findToken(refreshToken){
        const tokenData = await TokenUser.findOne({where:{RefreshToken:refreshToken}});
        return tokenData;
    }
}

module.exports = TokenService;