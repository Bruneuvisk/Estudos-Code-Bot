const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let guildSchema = new Schema({
  idServer: { type: String },
  cmdblock: {
    channels: { type: Array, default: [] },
    cmds: { type: Array, default: [] }
  },
  modmail: {
    status: { type: Boolean, default: false },
    staff: { type: String, default: "null" },
    logs: { type: String, default: "null" },
    category: { type: String, default: "null" },
  }
})

let Guild = mongoose.model("guilds", guildSchema);
module.exports = Guild;
