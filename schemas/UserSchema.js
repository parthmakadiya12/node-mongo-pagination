const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      number: {
        type: String,
        default: "1234"
      }
    });

module.exports = mongoose.model("user", UserSchema);
