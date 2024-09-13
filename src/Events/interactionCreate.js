const { EmbedBuilder, ChannelType, ButtonStyle, AttachmentBuilder, PermissionsBitField, PermissionFlagsBits, InteractionType, ButtonBuilder, ActionRowBuilder, ButtonComponent, CommandInteraction, SelectMenuComponent, Client } = require("discord.js");


module.exports = {
  name: "interactionCreate",
  /**
  *
  * @param {Client} client
  * @param {CommandInteraction | ButtonComponent | SelectMenuComponent} interaction
  */
  run: async (client, interaction) => {

    if(interaction.type === InteractionType.ApplicationCommand) {
      const SlashCommands = client.slashCommands.get(interaction.commandName);
      if(!SlashCommands) return

      let prefix = client.config.prefix
      let color = client.config.color
      let config = client.config

      try {
        await SlashCommands.run(client, interaction, config, prefix, color);
      } catch (error) {
        if (interaction.replied) {
          await interaction.editReply({
              content: `Aconteceu algum erro ao executar este comando.`
          }).catch(() => { });
        } else {
            await interaction.reply({
                ephemeral: true,
                content: `Aconteceu algum erro ao executar este comando.`
            }).catch(() => { });
        }
        console.error(error)
      }
    }
  }
}
