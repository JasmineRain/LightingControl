const mongoose = require('mongoose');

let displaySchema = mongoose.Schema({
  classroom: Number,
  display: [{
    row: Number,
    col: Number,
    value: Number,
    host: Number,
    sequence: Number
  }]
});

let displayModel = mongoose.model('displayModel', displaySchema);

module.exports = displayModel;