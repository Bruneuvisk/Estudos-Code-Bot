const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let clientSchema = new Schema({
  _id: { type: String },
  manutencao: { type: Boolean, default: false },
  reason: { type: String },
  blacklist: { type: Array, default: [] },
  blacklistGuilds: { type: Array, default: [] },
  totalUsos: { type: Number, default: 1 },
  banGlobal: {
    members: { type: Array, default: [] },
  }
})

let Client = mongoose.model("estudos", clientSchema);
module.exports = Client;
