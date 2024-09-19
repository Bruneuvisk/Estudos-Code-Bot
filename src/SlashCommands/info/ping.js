// Importa classes e métodos necessários do pacote discord.js
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Exporta o comando como um módulo
module.exports = {
  // Nome do comando
  name: "ping",
  // Descrição do comando que aparece no Discord
  description: "[📋] Demonstra a Latência e a API sobre mim.",
  // Categoria do comando, usada para organizar
  category: "info",
  // Tempo de espera em segundos antes de poder usar o comando novamente
  cooldown: 3,
  typeCommand: "normal",
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  requiredroles: [],
  alloweduserids: [],
  cooldown: 10,
  options: [],
  // Função assíncrona que é executada quando o comando é usado
  run: async (client, interaction, config, prefix, color) => {

    // Cria uma embed personalizada que será enviada como resposta
    const embed = new EmbedBuilder()
      .setColor(color) // Define a cor da embed com base no parâmetro 'color'

      // Adiciona campos à embed, como a latência e o ping da API
      .addFields([
        { name: '⌛ Latência', value: `**${Date.now() - interaction.createdAt}ms**` }, // Calcula a latência com base no tempo atual menos o tempo de criação da interação
        { name: '💓 API', value: `**${Math.floor(client.ws.ping)}ms**` }, // Exibe o ping da API do Discord
      ])

      // Adiciona um rodapé (footer) com o ícone e o nome do servidor ou o avatar do bot
      .setFooter({
        text: "Ping!!",
        iconURL: `${interaction.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true })}` // Usa o ícone do servidor ou o avatar do bot
      });

    // Responde à interação com um conteúdo de texto e a embed criada
    return interaction.reply({ content: `🏓 Pong!`, embeds: [embed] });
  }
};
