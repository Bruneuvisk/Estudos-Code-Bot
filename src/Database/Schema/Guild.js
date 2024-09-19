const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let guildSchema = new Schema({
  idServer: { type: String },
  cmdblock: {
    channels: { type: Array, default: [] },
    cmds: { type: Array, default: [] }
  },
})

let Guild = mongoose.model("guilds", guildSchema);
module.exports = Guild;
