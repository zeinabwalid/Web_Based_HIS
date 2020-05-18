const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { Medicine, validateMedicine } = require("../models/medicine");

// routes

// Add medicine
router.post("/add_medicine", async (req, res) => {
  // Validate The Request
  const { error } = validateMedicine(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Check if already exisits
  let medicine = await Medicine.findOne({ name: req.body.name });
  if (medicine) {
    return res.status(400).send("That medicine already exisits!");
  } else {
    // Insert the new medicine if they do not exist yet
    medicine = new Medicine(
      _.pick(req.body, [
        "name",
        "quantity",
        "date",
        "dose",
        "price",
        "replacements"
      ])
    );
    await medicine.save();
    const medicines = await Medicine.find({}) ;
      res.render("view_medicine",{layout:false ,medicines:medicines});
      }
});

router.put("/:id", async (req, res) => {
  const { error } = validateMedicine(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      quantity: req.body.quantity,
      date: req.body.date,
      dose: req.body.dose,
      price: req.body.price,
      replacements: req.body.replacements
    },
    { new: true }
  );

  if (!medicine)
    return res
      .status(404)
      .send("The medicine with the given ID was not found.");

  res.send(medicine);
});

//delete
router.delete("/:id", async (req, res) => {
  const medicine = await Medicine.findByIdAndRemove(req.params.id);

  if (!medicine)
    return res
      .status(404)
      .send("The medicine with the given ID was not found.");

  res.send(medicine);
});
//..............................




  router.get("/",async (req, res) => {
    const medicines = await Medicine.find({}) ;
    //res.render('frontend page',{medicines:medicines})
    res.render("view_medicine",{layout:false ,medicines:medicines});
  });
  
  router.get("/:id",async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).send("The medicine with the given ID was not found.");
    res.send(medicine);
  });
  


module.exports = router;
