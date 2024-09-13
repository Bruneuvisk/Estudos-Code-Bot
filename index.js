const EstudosCode = require("./src/Structures/Client")
const client = new EstudosCode();

client.connect()

require("./src/Handlers/slashCommands")(client)
require("./src/Handlers/events")(client)

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
  console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err, origin);
});

module.exports = client;
