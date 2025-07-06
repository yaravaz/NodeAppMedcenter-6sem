module.exports = class PatientDto {
    id;
    firstName;
    lastName;
    patronymic;
    birthdate;
    gender;
    phone;
    userId;

    constructor(model) {
        this.id = model.ID;
        this.firstName = model.First_Name;
        this.lastName = model.Last_Name;
        this.patronymic = model.Patronymic;
        this.birthdate = model.Birthdate;
        this.gender = model.Gender;
        this.phone = model.Phone;
        this.userId = model.User_ID;
    }

}