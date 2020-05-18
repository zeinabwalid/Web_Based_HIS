const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const mangerSchema = new mongoose.Schema({
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
  ssn: {
    type: String,
    required: true,
    unique: true,
    length: 14
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
  salary: {
    type: Number,
    required: true
  },
  phone_number: {
    type: [{ type: Number }], // array of numbers
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },

  Doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  Nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse"
  },
  Eng: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Eng"
  },
  Feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback"
  }
});

mangerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

// Manger Schema
const Manger = mongoose.model("Manger", mangerSchema);

function validateManger(manger) {
  const schema = Joi.object().keys({
    firstName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    ssn: Joi.string()
      .required()
      //.unique()
      .length(14),
    email: Joi.string()
      .required()
      .email()
      .min(5)
      .max(255),
    //.unique(),
    gender: Joi.string().required(),
    // .enum(),
    salary: Joi.number().required(),
    phone_number: Joi.number().required(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  });

  return Joi.validate(manger, schema);
}

exports.Manger = Manger;
exports.validateManger = validateManger;
