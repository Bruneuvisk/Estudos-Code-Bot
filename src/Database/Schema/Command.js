const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commandsSchema = new Schema({
  _id: { type: String },
  manuntencao: { type: Boolean, default: false },
  usages: { type: Number, default: 1 },
  reason: { type: String, default: 'null' },
});

let Commands = mongoose.model("commands", commandsSchema);
module.exports = Commands;
