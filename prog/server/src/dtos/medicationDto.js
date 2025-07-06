module.exports = class MedicationDto {
    id;
    pharmSubgroup;
    ign;
    dosageForm;
    price;
    isAvailable;

    constructor(model) {
        this.id = model.ID;
        this.pharmSubgroup = model.Pharm_Subgroup;
        this.ign = model.IGN;
        this.dosageForm = model.Dosage_Form;
        this.price = model.Price;
        this.isAvailable = model.isAvailable;
    }
}