// Importa várias classes do pacote discord.js para gerenciar mensagens e clientes
const { EmbedBuilder, Collection, Client, Message, ChannelType } = require("discord.js");

module.exports = {
  // Nome do evento, neste caso é 'messageCreate'
  name: "messageCreate",

  /**
   * Função que é chamada quando uma mensagem é criada
   * @param {Client} client - O cliente do Discord
   * @param {Message} message - A mensagem criada
   * @returns {Promise<void>}
   */
  run: async (client, message) => {
    try {
      // Obtém configurações e prefixo do cliente
      let config = client.config;
      let prefix = config.prefix;
      let color = config.color;

      // Ignora mensagens enviadas por bots
      if (message.author.bot) return;

      // Ignora mensagens enviadas em canais diretos (DM)
      if (message.channel.type === ChannelType.DM) return;

      // Verifica se a mensagem menciona o bot
      if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
        // Cria uma embed para responder à menção do bot
        let embedset = new EmbedBuilder()
          .setTitle(`Opa alguém me chamou?`)
          .setDescription(`Olá ${message.author}, eu sou o **__${client.user.username}__**. Sou o bot criado para ser testado em meu canal do YouTube. Abaixo estão algumas informações básicas sobre mim:\n\n Meu atual prefixo é: **${prefix}**`)
          .setColor(color)
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` });

        // Envia a resposta e a deleta após 35 segundos
        message.reply({ embeds: [embedset] }).then(xxx => {
          setTimeout(() => xxx.delete(), 35000);
        });
      }

      // Função para escapar caracteres especiais em uma string
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Cria uma expressão regular para combinar o prefixo ou menção do bot
      const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

      // Se a mensagem não começar com o prefixo ou menção, sai da função
      if (!prefixRegex.test(message.content)) return;

      // Obtém o prefixo combinado da mensagem
      const [matchedPrefix] = message.content.match(prefixRegex);

      // Divide a mensagem em argumentos
      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Obtém o comando correspondente do cliente
      const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      // Se o comando for encontrado, mas não for um comando de barra (slash command), responde com uma mensagem de erro
      if (command) {
        return message.reply({ content: `${emojis.emojierror} | ${message.member}, Eu sou totalmente feito em comandos de / por favor utilizar o comando de / para realizar minhas funções.` });
      }

      // Executa o comando, passando o cliente, a mensagem, os argumentos, a configuração, o prefixo e a cor
      command.execute(client, message, args, config, prefix, color, emojis);
    } catch (err) {
      // Se ocorrer um erro, registra-o no console
      if (err) console.error(err);
    }
  }
};
