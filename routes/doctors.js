const express = require("express");
const router = express.Router();
//const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt =  require("bcryptjs")
//const jwt = require("jsonwebtoken")
const _ = require("lodash");
const { Doctor, validateDoctor } = require("../models/doctor");

//create doctor
 router.post("/add_doctor", async (req, res) => {
 //Validate The Request
const { error } = validateDoctor(req.body);
 if (error) {
   return res.status(400).send(error.details[0].message);
 }
//   //Check if this doctor already exisits
  let doctor = await Doctor.findOne({ ssn: req.body.ssn });
  if (doctor) {
    return res.status(400).send("That doctor already exisits!");
  } else {
//     
    doctor =new Doctor(_.pick(req.body,[
    'ssn',
    'title',
    'firstName',
    'lastName',
    'email',
    'gender',
    'salary',
    'phone_number',
    'password']));
   
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(doctor.password,salt);
    await doctor.save();
    const doctors = await Doctor.find({}) ;
    res.render("view_doctor",{layout:false ,doctors:doctors});

  }
 
});
  
 


router.put('/:id', async (req, res) => {
  const { error } = validateDoctor(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const doctor = await Doctor.findByIdAndUpdate(req.params.id,
    { 
      ssn: req.body.ssn,
      title: req.body.title,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      salary: req.body.salary,
      phone_number: req.body.phone_number,
      password: req.body.password

    }, { new: true });

    if (!doctor) return res.status(404).send('The doctor with the given ID was not found.');
  
  res.send(doctor);
});

// delete

router.delete("/:id", async (req, res) => {
  const doctor = await Doctor.findByIdAndRemove(req.params.id);

  if (!doctor)
    return res.status(404).send("The doctor with the given ID was not found.");

  res.send(doctor);
});
//..................

//read

router.get("/",async (req, res) => {
  const doctors = await Doctor.find({}) ;
  res.render("view_doctor",{layout:false ,doctors:doctors});
});

router.get("/:id",async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send("The doctor with the given ID was not found.");
  res.send(doctor);
});

  
  module.exports = router;


