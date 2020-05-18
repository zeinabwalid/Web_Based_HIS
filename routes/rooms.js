const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Room, validateRoom } = require("../models/room");

// routes

// Add room
router.post("/add_room", async (req, res) => {
  // Validate The Request
  const { error } = validateRoom(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let room = await Room.findOne({ room_number: req.body.room_number });
  if (room) {
    return res.status(400).send("That room already exisits!");
  } else {
    // Insert the new room if they do not exist yet
    room = new Room(
      _.pick(req.body, [
        "room_number",
        "vacancyOfRoom",
        "numberOfEquipment",
        "nameOfEquipment"
      ])
    );
    await room.save();
    const rooms = await Room.find({}) ;
    res.render("view_room",{layout:false ,rooms:rooms});  
   }
});



router.put("/:id", async (req, res) => {
  const { error } = validateRoom(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const room = await Room.findByIdAndUpdate(
    req.params.id,
    {
      room_number: req.body.room_number,
    vacancyOfRoom: req.body.vacancyOfRoom,
    numberOfEquipment:req.body.numberOfEquipment,
    nameOfEquipment: req.body.nameOfEquipment
    },
    { new: true }
  );

  if (!room)
    return res.status(404).send("The room with the given ID was not found.");

  res.send(room);
});
//delete
router.delete("/:id", async (req, res) => {
  const room = await Room.findByIdAndRemove(req.params.id);

  if (!room)
    return res.status(404).send("The room with the given ID was not found.");

  res.send(room);
});
//............................

router.get("/",async (req, res) => {
  const rooms = await Room.find({}) ;
  //res.render('frontend page',{rooms:rooms})
  res.render("view_room",{layout:false ,rooms:rooms});  
});

router.get("/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room)
    return res.status(404).send("The room with the given ID was not found.");
  res.send(room);
});

module.exports = router;
