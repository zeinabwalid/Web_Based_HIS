const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
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
    maxlenght: 1024,
    minlenght: 5
  },

  Doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    firstName: {
      type: String,
      required: true,
      minlenght: 3,
      maxlenght: 50
    },

    lastName: {
      type: String,
      required: true,
      minlenght: 3,
      maxlenght: 50
    },
    phone_number: {
      //number wla string??
      type: [{ type: Number }], // array of numbers
      required: true
    }
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
  },
  Room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    vacancyOfRoom: {
      type: String,
      requied: true,
      enum: ["Empty", "Full"]
    }
  },
  Patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    firstName: {
      type: String,
      required: true,
      minlenght: 3,
      maxlenght: 50
    },

    lastName: {
      type: String,
      required: true,
      minlenght: 3,
      maxlenght: 50
    },
    Dep_phone_number: {
      type: [{ type: Number }],
      required: true
    }
  },
  Medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    name: {
      type: [String],
      required: true
    },
    date: {
      type: [Date],
      required: true
    },
    dose: {
      type: String,
      required: true
    },
    replacements: {
      type: [String],
      required: true
    }
  },
  Equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    sterileDates: {
      type: Date,
      required: true
    },
    sterileOperation: {
      type: String,
      require: true
    }
  }
});

nurseSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};
// Nurse Schema
const Nurse = mongoose.model("Nurse", nurseSchema);

function validateNurse(nurse) {
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
      .min(5)
      .max(255)
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

  return Joi.validate(nurse, schema);
}

exports.Nurse = Nurse;
exports.validateNurse = validateNurse;
