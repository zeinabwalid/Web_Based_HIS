const express = require("express");
const router = express.Router();
const { Nurse, validateNurse } = require("../models/nurse");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

// routes
// Add nurse
router.post("/add_nurse", async (req, res) => {
  // Validate The Request
  const { error } = validateNurse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let nurse = await Nurse.findOne({ ssn: req.body.ssn });
  if (nurse) {
    return res.status(400).send("That nurse already exisits!");
  } else {
    // Insert the new nurse if they do not exist yet
    nurse = new Nurse(
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
    nurse.password = await bcrypt.hash(nurse.password, salt);
    await nurse.save();
    const nurses = await Nurse.find({}) ;
      res.render("view_nurse",{layout:false ,nurses:nurses});
      }
});

router.put("/:id", async (req, res) => {
  const { error } = validateNurse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const nurse = await Nurse.findByIdAndUpdate(
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

  if (!nurse)
    return res.status(404).send("The nurse with the given ID was not found.");

  res.send(nurse);
});

//delete
router.delete("/:id", async (req, res) => {
  const nurse = await Nurse.findByIdAndRemove(req.params.id);

  if (!nurse)
    return res.status(404).send("The nurse with the given ID was not found.");

  res.send(nurse);
});
//................................



router.get("/",async (req, res) => {
  const nurses = await Nurse.find({}) ;
  //res.render('frontend page',{nurses:nurses})
  res.render("view_nurse",{layout:false ,nurses:nurses});
});

router.get("/:id", async (req, res) => {
  const nurse = await Nurse.findById(req.params.id);
  if (!nurse)
    return res.status(404).send("The nurse with the given ID was not found.");
  res.send(nurse);
});

module.exports = router;
