const mongoose = require("mongoose");

const User = new mongoose.Schema({
  // _creator: [{type: mongoose.Schema.Types.ObjectId}],
  firstName: { type: String, required: false, maxlength: 50 },
  lastName: { type: String, required: false, maxlength: 50 },
  username: { type: String, required: true,index:true, unique: true },
  userType: { type: String, required: false },
  password: { type: String, required: false, minlength: 8, maxlength: 1024 },
  email: { index:true,sparse:true,
    type: String,
    required: true,
    maxlength: 255,
    unique: true,
    lowercase: true,
  },
  mobile: { type: String, required: false },
  profilePicture: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports.User = mongoose.model("User", User);
