const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: {
        type: String,
      }
    });

module.exports = mongoose.model("news", NewsSchema);
