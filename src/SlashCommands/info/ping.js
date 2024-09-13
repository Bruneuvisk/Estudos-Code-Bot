const { EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
  name: "ping",
  description: "[📋] Demonstra a Latência e a API sobre mim.",
  category: "info",
  cooldown: 3,
  run: async (client, interaction, config, prefix, color) => {
      const embed = new EmbedBuilder()
          .setColor(color)
          .addFields([
            { name: '⌛ Latência', value: `**${Date.now() - interaction.createdAt}ms**` },
            { name: '💓 API', value: `**${Math.floor(client.ws.ping)}ms**` },
          ])
          .setFooter({ text: "Ping!!", iconURL: `${interaction.guild.iconURL({dynamic: true}) || client.user.displayAvatarURL({ dynamic: true })}` })
      return interaction.reply({ content: `🏓 Pong!`, embeds: [embed] })
  }
}
