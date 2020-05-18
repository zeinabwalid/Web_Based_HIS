const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  ssn: {
    type: String,
    required: true,
    unique: true,
    length: 14
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },

  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlenght: 5,
    maxlenght: 255
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  Dep_phone_number: {
    type: [{ type: Number }],
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  history: {
    type: String,
    required: true
  },
  entryDate: {
    type: Date,
    required: true
  },
  exitDate: {
    type: Date
    },
    
      image : {
      type : String
    },
    // data: Buffer, contentType: String 
       

  Medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    date: {
      type: [Date],
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
    quantity: {
      type: Number,
      required: true
    }
  },
  Nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse",
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    }
  },
  Doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },

    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    }
  }
});

patientSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};
// Define a schema
const Patient = mongoose.model("Patient", patientSchema);

function validatePatient(patient) {
  const schema = Joi.object().keys({
    //de al data ali h5lii user ed5lha
    ssn: Joi.string()
      .required()
      //.unique()
      .length(14),
    firstName: Joi.string()
      .required()
      .min(3)
      .max(50),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(50),
    email: Joi.string()
      .required()
      .email(),

    gender: Joi.string().required(),
    // .enum(),
    Dep_phone_number: Joi.string().required(),

    password: Joi.string()
      .required()
      .min(5)
      .max(1024),
    history: Joi.string().required(),
    entryDate: Joi.date().required(),
  });

  return Joi.validate(patient, schema);
}

exports.Patient = Patient;
exports.validate = validatePatient;

// To add additional functionality to schema
//PatientSchema.plugin(uniqueValidator);

// Compile our model
//const Patient = (module.exports = mongoose.model("Patient", PatientSchema));
