const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { Manger, validateManger } = require("../models/manger.js");

// routes

// Add manger
router.post("/add_manger", async (req, res) => {
  // Validate The Request
  const { error } = validateManger(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let manger = await Manger.findOne({ ssn: req.body.ssn });
  if (manger) {
    return res.status(400).send("That manger already exisits!");
  } else {
    // Insert the new manger if they do not exist yet
    manger = new Manger(
      _.pick(req.body, [
        "ssn",
        "firstName",
        "lastName",
        "email",
        "gender",
        "phone_number",
        "password",
        "salary"
      ])
    );
    const salt = await bcrypt.genSalt(10);
    manger.password = await bcrypt.hash(manger.password, salt);
    await manger.save();
    res.send(manger);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateManger(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const manger = await Manger.findByIdAndUpdate(
    req.params.id,
    {
      ssn: req.body.ssn,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      salary: req.body.salary,
      phone_number: req.body.phone_number,
      password: req.body.password
    },
    { new: true }
  );

  if (!manger)
    return res.status(404).send("The manger with the given ID was not found.");

  res.send(manger);
});

//delete
router.delete("/:id", async (req, res) => {
  const manger = await Manger.findByIdAndRemove(req.params.id);

  if (!manger)
    return res.status(404).send("The manger with the given ID was not found.");

  res.send(manger);
});
//.................



router.get("/", async (req, res) => {
  const managers = await Manger.find({});
  //res.render("frontend page", { managers: managers });
  res.send(managers);
});

router.get("/:id", async (req, res) => {
  const manager = await Manger.findById(req.params.id);
  if (!manager)
    return res.status(404).send("The manager with the given ID was not found.");
  res.send(manager);
});

module.exports = router;
