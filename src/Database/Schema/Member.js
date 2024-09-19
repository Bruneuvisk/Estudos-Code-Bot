const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let memberSchema = new Schema({
  idUser: { type: String },
  tag: { type: String },
})

let Member = mongoose.model("members", memberSchema);
module.exports = Member;
