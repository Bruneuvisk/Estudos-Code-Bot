// Importa classes e métodos necessários do pacote discord.js
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getClientDatabase, getGuildDatabase, getUserDatabase, getComanndsDatabase } = require("../../Structures/Functions")
// Exporta o comando como um módulo
module.exports = {
  // Nome do comando
  name: "setup",
  // Descrição do comando que aparece no Discord
  description: "[📋] Exibe os comandos de setup.",
  // Categoria do comando, usada para organizar
  category: "config",
  // Tempo de espera em segundos antes de poder usar o comando novamente
  cooldown: 3,
  typeCommand: "normal",
  MemberPerm: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Administrator],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  requiredroles: [],
  alloweduserids: [],
  cooldown: 10,
  options: [
    {
      name: "set",
      description: "Qual setup deseja configurar",
      required: false,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: 'modmail', value: "modmail" },
        { name: 'botlist', value: "botlist" },
        { name: 'ticket', value: "ticket" },
      ]
    }
  ],
  // Função assíncrona que é executada quando o comando é usado
  run: async (client, interaction, config, prefix, color) => {
    const choice = interaction.options.getString("set")
    const server = await getGuildDatabase(client, interaction.guild.id)

    if(choice === 'modmail') {

    }
  }
}
