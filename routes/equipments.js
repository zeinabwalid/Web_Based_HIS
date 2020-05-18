const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { Equipment, validateEquipment } = require("../models/equipment");

// routes

// Add Equipment
router.post("/add_equipment", async (req, res) => {
  // Validate The Request
  const { error } = validateEquipment(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let equipment = await Equipment.findOne({ code: req.body.code });
  if (equipment) {
    return res.status(400).send("That equipment already exisits!");
  } else {
    // Insert the new equipment if they do not exist yet
    equipment = new Equipment(
      _.pick(req.body, [
        "equipment_name",
        "code",
        "maintanince_date",
        "status",
        "sterileDates",
        "sterileOperation"
      ])
    );
    await equipment.save();
    const equipments = await Equipment.find({}) ;
    res.render("view_equipment",{layout:false ,equipments:equipments});  
  }
});

router.put("/api/equipments/:id", async (req, res) => {
  const { error } = validateEquipment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    {
      equipment_name: req.body.equipment_name,
      code: req.body.code,
      maintanince_date: req.body.maintanince_date,
      status: req.body.status,
      sterileDates: req.body.sterileDates,
      sterileOperation: req.body.sterileOperation
    },
    { new: true }
  );

  if (!equipment) return res.status(404)
.send("The equipment with the given ID was not found.");

  res.send(equipment);
});

//delete
router.delete("/:id", async (req, res) => {
  const equipment = await Equipment.findByIdAndRemove(req.params.id);

  if (!equipment)
    return res
      .status(404)
      .send("The equipment with the given ID was not found.");

  res.send(equipment);
});
//...........................

router.get("/", async (req, res) => {
  const equipments = await Equipment.find().sort({});
 // res.render("frontend page", { equipments: equipments });
 res.render("view_equipment",{layout:false ,equipments:equipments});  
});

router.get("/:id", async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment)
    return res
      .status(404)
      .send("The equipment with the given ID was not found.");
  res.send(equipment);
});

module.exports = router;
