module.exports = class AppointmentDto {
    id;
    patientId;
    doctorId;
    appointmentData;
    isDenied;

    constructor(model) {
        this.id = model.ID;
        this.patientId = model.Patient_ID;
        this.doctorId = model.Doctor_ID;
        this.appointmentData = model.Appointment_Date;
        this.isDenied = model.isDenied;
    }
}