const { EmbedBuilder, Collection, Client, Message, ChannelType } = require("discord.js")


module.exports ={
  name: "messageCreate",
  /**
  *
  * @param {Client} client
  * @param {Message} message
  * @returns
  */
  run: async (client, message) => {
    try {
      let config = client.config
      let prefix = config.prefix
      let color = config.color

      if (message.author.bot) return;
      if (message.channel.type === ChannelType.DM) return

      if(message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
          let embedset = new EmbedBuilder()
              .setTitle(`Opa alguém me chamou?`)
              .setDescription(`Olá ${message.author}, eu sou o **__${client.user.username}__** sou o bot criado para ser testado em meu canal do youtube, abaixo algumas informações básicas sobre mim: \n\n Meu atual prefixo é: **${prefix}**`)
              .setColor(color)
              .setThumbnail(client.user.displayAvatarURL())
              .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
          message.reply({ embeds: [embedset] }).then(xxx =>{
              setTimeout(() => xxx.delete(), 35000)
          })
      }

      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
      if (!prefixRegex.test(message.content)) return;

      const [matchedPrefix] = message.content.match(prefixRegex);

      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (command) {
          return message.reply({ content: `${emojis.emojierror} | ${message.member}, Eu sou totalmente feito em comandos de / por favor utilizar o comando de / para realizar minhas funções.` })
      };

      command.execute(client, message, args, config, prefix, color, emojis);
    } catch (err) {
        if (err) console.error(err);
    }
  }
}

