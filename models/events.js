const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("events", eventsSchema);