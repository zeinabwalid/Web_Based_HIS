const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Medicine = mongoose.model(
  "Medicine",
  new mongoose.Schema({
    name: {
      //   type: [String],
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    date: {
      //   type: [Date],
      type: Date,
      required: true
    },
    dose: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    replacements: {
      type: [String],
      required: true
    }
  })
);

function validateMedicine(medicine) {
  const schema = Joi.object().keys({
    //de al data ali h5lii user ed5lha
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    date: Joi.date().required(),
    dose: Joi.string().required(),
    price: Joi.number().required(),
    replacements: Joi.string().required()
  });

  return Joi.validate(medicine, schema);
}

exports.Medicine = Medicine;
exports.validateMedicine = validateMedicine;

// To add additional functionality to schema
//MedicineSchema.plugin(uniqueValidator);

// Compile our model
//const PatientMedicine = (module.exports = mongoose.model("Medicine", MedicineSchema));
