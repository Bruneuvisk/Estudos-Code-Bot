// Importa o pacote 'colors' para estilizar a saída do console com cores
const colors = require("colors");

// Importa o pacote 'moment' para formatar a data e hora
const moment = require("moment");

// Define e exporta a classe Logger
module.exports = class Logger {

  // Método estático que registra mensagens no console com base no tipo especificado
  static log(content, type = "log") {
    // Obtém a data e hora atual formatada como "DD-MM-YYYY hh:mm:ss"
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;

    // Verifica o tipo de log e define o comportamento de saída no console
    switch (type) {

      // Caso seja um log comum
      case "log": {
        // Exibe a mensagem no console com cor azul para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgBlue}] ${content.bgBlue}`);
      }

      // Caso seja um aviso (warn)
      case "warn": {
        // Exibe a mensagem no console com cor amarela para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgYellow}] ${content.bgYellow}`);
      }

      // Caso seja um erro (error)
      case "error": {
        // Exibe a mensagem no console com cor vermelha para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgRed}] ${content.bgRed}`);
      }

      // Caso seja um debug
      case "debug": {
        // Exibe a mensagem no console com cor verde para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgGreen}] ${content.bgGreen}`);
      }

      // Caso seja um comando (cmd)
      case "cmd": {
        // Exibe a mensagem no console com cor branca para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgWhite}] ${content.bgWhite}`);
      }

      // Caso seja um evento
      case "event": {
        // Exibe a mensagem no console com cor branca para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgWhite}] ${content.bgWhite}`);
      }

      // Caso o bot esteja pronto (ready)
      case "ready": {
        // Exibe a mensagem no console com cor azul para o tipo
        return console.log(`[${date.gray}]: [${type.toUpperCase().bgBlue}] ${content.bgBlue}`);
      }

      // Caso o tipo fornecido não seja suportado
      default:
        // Lança um erro de tipo se o tipo não for um dos especificados
        throw new TypeError("O tipo de registrador deve ser warn, debug, log, ready, cmd ou error.");
    }
  }
};
