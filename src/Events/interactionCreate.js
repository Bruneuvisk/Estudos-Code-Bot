// Importa várias classes e métodos do pacote discord.js para gerenciar interações e componentes
const { EmbedBuilder, ChannelType, ButtonStyle, AttachmentBuilder, PermissionsBitField, PermissionFlagsBits, InteractionType, ButtonBuilder, ActionRowBuilder, ButtonComponent, CommandInteraction, SelectMenuComponent, Client } = require("discord.js");

module.exports = {
  // Nome do evento, neste caso é 'interactionCreate'
  name: "interactionCreate",

  /**
   * Função que é chamada quando uma interação é criada
   * @param {Client} client - O cliente do Discord
   * @param {CommandInteraction | ButtonComponent | SelectMenuComponent} interaction - O tipo de interação recebida
   */
  run: async (client, interaction) => {
    // Verifica se a interação é um comando de barra (slash command)
    if (interaction.type === InteractionType.ApplicationCommand) {
      // Obtém o comando de barra associado ao nome do comando
      const SlashCommands = client.slashCommands.get(interaction.commandName);

      // Se o comando não for encontrado, sai da função
      if (!SlashCommands) return;

      // Obtém o prefixo, cor e configuração do bot a partir da configuração
      let prefix = client.config.prefix;
      let color = client.config.color;
      let config = client.config;

      try {
        // Executa o comando de barra
        await SlashCommands.run(client, interaction, config, prefix, color);
      } catch (error) {
        // Se houver um erro ao executar o comando, envia uma resposta de erro
        if (interaction.replied) {
          // Se a interação já foi respondida, edita a resposta existente
          await interaction.editReply({
              content: `Aconteceu algum erro ao executar este comando.`
          }).catch(() => { }); // Ignora erros ao editar a resposta
        } else {
            // Se a interação não foi respondida, envia uma resposta efêmera
            await interaction.reply({
                ephemeral: true, // Resposta visível apenas para o usuário que fez a interação
                content: `Aconteceu algum erro ao executar este comando.`
            }).catch(() => { }); // Ignora erros ao enviar a resposta
        }
        // Registra o erro no console
        console.error(error);
      }
    }
  }
};
