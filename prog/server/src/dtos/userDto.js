module.exports = class UserDto{
    id;
    login;
    role;
    constructor(model){
        this.id = model.ID;
        this.login = model.Login;
        this.role = model.Role;
    }
}