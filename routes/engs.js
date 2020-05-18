const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { Eng, validateEng } = require("../models/eng");

// routes
// Add eng
router.post("/add_eng", async (req, res) => {
  // Validate The Request
  const { error } = validateEng(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let eng = await Eng.findOne({ ssn: req.body.ssn });
  if (eng) {
    return res.status(400).send("That eng already exisits!");
  } else {
    // Insert the new eng if they do not exist yet
    eng = new Eng(
      _.pick(req.body, [
        "ssn",
        "firstName",
        "lastName",
        "email",
        "gender",
        "password",
        "salary",
        "phone_number"
      ])
    );
    const salt = await bcrypt.genSalt(10);
    eng.password = await bcrypt.hash(eng.password, salt);
    await eng.save();
    const engineers = await Eng.find({}) ;
    res.render("view_engineer",{layout:false ,engineers:engineers});  
   }
});

router.put("/:id", async (req, res) => {
  const { error } = validateEng(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const eng = await Eng.findByIdAndUpdate(
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

  if (!eng)
    return res
      .status(404)
      .send("The engineer with the given ID was not found.");

  res.send(eng);
});

//delete
router.delete("/:id", async (req, res) => {
  const eng = await Eng.findByIdAndRemove(req.params.id);

  if (!eng)
    return res.status(404).send("The eng with the given ID was not found.");

  res.send(eng);
});
//.....................

router.get("/", async (req, res) => {
  const engs = await Eng.find().sort({});
 // res.render("frontend page", { engs: engs });
 res.render("view_engineer",{layout:false ,engineers:engs});  
});

router.get("/:id", async (req, res) => {
  const eng = await Eng.findById(req.params.id);
  if (!eng)
    return res
      .status(404)
      .send("The engineer with the given ID was not found.");
  res.send(eng);
});

module.exports = router;
