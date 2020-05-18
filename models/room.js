const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    room_number: {
      type: String,
      required: true,
      unique: true,
      length: 4
    },
    vacancyOfRoom: {
      type: String,
      requied: true,
      enum: ["Empty", "Full"]
    },

    numberOfEquipment: {
      type: Number,
      required: true
    },

    nameOfEquipment: {
      type: [String],
      required: true
    }
  })
);

function validateRoom(room) {
  const schema = Joi.object().keys({
    //de al data ali h5lii user ed5lha
    room_number: Joi.string()
      .required()
      //.unique()
      .length(4),
    vacancyOfRoom: Joi.string().required(),
    numberOfEquipment: Joi.number().required(),
    nameOfEquipment: Joi.string().required()
  });

  return Joi.validate(room, schema);
}

exports.Room = Room;
exports.validateRoom = validateRoom;
