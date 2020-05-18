const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const engSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  ssn: {
    type: String,
    required: true,
    unique: true,
    length: 10
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
    minlength: 5,
    maxlenght: 1024,
    required: true
  },
  Room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    numberOfEquipment: {
      type: Number,
      required: true
    },
    nameOfEquipment: {
      type: [String],
      required: true
    }
  },
  Equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment"
  },
  Manger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manger",
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
      minlength: 5,
      maxlenght: 1024,
      required: true
    },
    Room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      numberOfEquipment: {
        type: Number,
        required: true
      },
      nameOfEquipment: {
        type: [String],
        required: true
      }
    },
    Equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment"
    },
    Manger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manger",
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
      }
    }
  }
});

engSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

// Eng Schema
const Eng = mongoose.model("Eng", engSchema);

function validateEng(eng) {
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
      .email(),
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

  return Joi.validate(eng, schema);
}

// To add additional functionality to schema

exports.Eng = Eng;
exports.validateEng = validateEng;
