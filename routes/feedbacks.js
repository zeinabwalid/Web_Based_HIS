const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Feedback, validateFeedback } = require("../models/feedback");

// Add feedback
router.post("/add_feedback", async (req, res) => {
  // Validate The Request
  const { error } = validateFeedback(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  feedback = new Feedback(
    _.pick(req.body, ["name", "email", "subject", "message"])
  );
  await feedback.save();
  res.send(feedback);
});

router.get("/", async (req, res) => {
  const feedbacks = await Feedback.find({});
 // res.render("frontend page", { feedbacks: feedbacks });
  res.send(feedbacks);
});

router.get("/:id", async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback)
    return res
      .status(404)
      .send("The feedback with the given ID was not found.");
  res.send(feedback);
});

module.exports = router;
