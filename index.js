// Importa a classe Client do arquivo "./src/Structures/Client"
const EstudosCode = require("./src/Structures/Client");

// Cria uma nova instância do client
const client = new EstudosCode();

// Conecta o bot ao Discord
client.connect();

// Carrega e registra os comandos de barra (/commands)
require("./src/Handlers/slashCommands")(client);

// Carrega os eventos do bot
require("./src/Handlers/events")(client);

// Lida com erros de promessas não tratadas (unhandledRejection)
process.on('unhandledRejection', (reason, p) => {
  // Exibe o motivo do erro e a promessa rejeitada
  console.log(reason, p);
});

// Lida com exceções não capturadas no código (uncaughtException)
process.on('uncaughtException', (err, origin) => {
  // Exibe o erro e sua origem
  console.log(err, origin);
});

// Monitor de exceções não capturadas (similar ao uncaughtException, mas com comportamento monitorado)
process.on('uncaughtExceptionMonitor', (err, origin) => {
  // Exibe o erro e sua origem
  console.log(err, origin);
});

// Exporta o client para ser utilizado em outros arquivos
module.exports = client;
