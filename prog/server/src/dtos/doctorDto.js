module.exports = class DoctorDto {
    id;
    firstName;
    lastName;
    patronymic;
    birthdate;
    phone;
    specialization;
    category;
    photo;
    userId;
    schedule;

    constructor(model) {
        this.id = model.ID;
        this.firstName = model.First_Name;
        this.lastName = model.Last_Name;
        this.patronymic = model.Patronymic;
        this.birthdate = model.Birthdate;
        this.phone = model.Phone;
        this.specialization = model.Specialization;
        this.category = model.Category;
        this.photo = model.Photo;
        this.userId = model.User_ID;
        this.schedule = model.Schedules?.map(s => ({
            day_of_week: s.Day_of_week,
            start_time: s.Start_time,
            end_time: s.End_time,
            interval: s.Interval
        })) || [];
    }
}