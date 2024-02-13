const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  // confirmPassword: {
  //   type: String,
  //   required: true,
  // },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;

// },{timestamps:true})
