const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

//Define Schema
const Feedback = mongoose.model(
  "Feedback",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlenght: 5,
      maxlenght: 255
    },
    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    }
  })
);

function validateFeedback(feedback) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .required()
      .min(3)
      .max(50),
    email: Joi.string()
      .required()
      .email()
      .min(5)
      .max(255),
    subject: Joi.string().required(),
    message: Joi.string().required()
  });

  return Joi.validate(feedback, schema);
}

exports.Feedback = Feedback;
exports.validateFeedback = validateFeedback;
