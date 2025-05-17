var express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
var router = express.Router();
const { User } = require("../models/users");
const auth = require("../middleware/auth.js");
const crypto=require('crypto')

/* POST User signin account. */
// router.post("/api/auth/signin", async (req, res) => {
//   //  Now find the user by their email address
//   let user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(400).send("Incorrect email or password.");
//   }

//   // Then validate the Credentials in MongoDB match
//   // those provided in the request
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) {
//     return res.status(400).send("Incorrect email or password.");
//   }
  
//   const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
//   res.send({ access_token: token });
// });
router.post("/api/auth/signin", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect email or password.");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect email or password.");
  }

  // Generate token
  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);

  // Convert MongoDB user object to plain object
  const userData = user.toObject();

  // Remove password and other sensitive info
  delete userData.password;

  // Respond with token and user data
  res.send({
    access_token: token,
    user: userData
  });
});

router.post("/", async (req, res) => {
  try {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await new User(req.body).save();

      res.send(user);
  } catch (error) {
      res.send("An error occureds");
      console.log(error);
  }
});



/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* POST User signup new account. */
router.post("/api/auth/signup", async function (req, res, next) {
  console.log(req.body.firstName);

  // Check if this user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("That user already exists!");
  } else {
    // Insert the new user if they do not exist yet
    user = new User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "password",
        "username",
      ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send(user);
  }
});



// // Reset passowrd
// router.post("/reset-password", async (req, res) => {
//   //  Now find the user by their email address
//   let user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(400).send("Incorrect email or password.");
//   }

//   // Then validate the Credentials in MongoDB match
//   // those provided in the request
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) {
//     return res.status(400).send("Incorrect email or password.");
//   }
  
//   const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
//   res.send({ access_token: token });
// });


module.exports = router;
