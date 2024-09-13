const { ActivityType } = require("discord.js")


module.exports = {
  name: "ready",
  run: async (client) => {
    client.user.setActivity('Sou o bot de teste do meu canal do youtube @EstudosCode segue lá!', { type: ActivityType.Watching });
    client.logger.log(`${client.user.username} online!`, "ready");
    client.logger.log(`O bot ${client.user.username} foi inicializado com ${client.guilds.cache.size} servidores e com ${client.users.cache.size} usuários.`, "ready");
  }
}
