// Importa a enumeração ActivityType do pacote discord.js para definir o tipo de atividade do bot
const { ActivityType } = require("discord.js");
const Guild = require("../Database/Schema/Guild")
const Member = require("../Database/Schema/Member")
const Client = require("../Database/Schema/Client")
const Commands = require("../Database/Schema/Command")

module.exports = {
  // Nome do evento, neste caso é 'ready'
  name: "ready",

  /**
   * Função que é chamada quando o bot está pronto e conectado ao Discord
   * @param {Client} client - O cliente do Discord
   */
  run: async (client) => {

    client.database.cliente = Client;
    client.database.members = Member;
    client.database.servidores = Guild;
    client.database.commands = Commands;
    // Define a atividade do bot para 'assistindo' com uma mensagem personalizada
    client.user.setActivity('Sou o bot de teste do meu canal do youtube @EstudosCode segue lá!', { type: ActivityType.Watching });

    // Loga no console que o bot está online
    client.logger.log(`${client.user.username} online!`, "ready");

    // Loga no console o número de servidores e usuários que o bot está gerenciando
    client.logger.log(`O bot ${client.user.username} foi inicializado com ${client.guilds.cache.size} servidores e com ${client.users.cache.size} usuários.`, "ready");
  }
}
