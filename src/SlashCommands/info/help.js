// Importa classes e métodos necessários do pacote discord.js
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Exporta o comando como um módulo
module.exports = {
  // Nome do comando
  name: "help",
  // Descrição do comando que aparece no Discord
  description: "[📋] Exibe todos os meus comandos.",
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
  options: [
    {
      name: "command",
      description: "Envie um nome de um comando para ver suas informações",
      required: false,
      type: ApplicationCommandOptionType.String,
    }
  ],
  // Função assíncrona que é executada quando o comando é usado
  run: async (client, interaction, config, prefix, color) => {
    let commandzin = interaction.options.getString("command")

    const { slashCommands } = client
    const data = []
    let page = 0

    if(!commandzin) {
      let bnt1 = new ButtonBuilder()
          .setLabel("Avançar")
          .setCustomId("avancar_id")
          .setEmoji("▶️")
          .setStyle(ButtonStyle.Primary)
      let bnt2 = new ButtonBuilder()
          .setLabel("Voltar")
          .setCustomId("voltar_id")
          .setEmoji("◀️")
          .setStyle(ButtonStyle.Primary)

      let menuzindecria = new StringSelectMenuBuilder()
          .setCustomId("selector_help")
          .setPlaceholder("Escolha qual categoria deseja exibir os comandos")
          .addOptions([
            {
              label: `Comandos de Informação - [${slashCommands.filter(command => command.category == "info").size}]`,
              description: `Lista os meus comandos de informações`,
              emoji: { name: "1️⃣", animated: false },
              value: "1",
            }
          ])

      let rowbnt = new ActionRowBuilder()
          .addComponents(bnt2, bnt1)
      let rowmenu = new ActionRowBuilder()
          .addComponents(menuzindecria)

      await interaction.reply({ embeds: [getEmbedPage(page)], components: [rowbnt, rowmenu] })

      const collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === 'selector_help' && i.user.id === interaction.member.id || i.customId === 'avancar_id' && i.user.id === interaction.member.id || i.customId === 'voltar_id' && i.user.id === interaction.member.id, time: 180000 })

      collector.on('collect', async i => {
          i.deferUpdate()

          if(i.isButton() && i.customId == "avancar_id") {
            page++
            if(page == 1) {
                bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)
                bnt2 = ButtonBuilder.from(bnt2).setDisabled(false)
            } else {
                bnt1 = ButtonBuilder.from(bnt1).setDisabled(false)
                bnt2 = ButtonBuilder.from(bnt2).setDisabled(false)
            }
            rowbnt = new ActionRowBuilder().addComponents(bnt2, bnt1)
            return interaction.editReply({ embeds: [getEmbedPage(page)], components: [rowbnt, rowmenu] })
          } else if(i.isButton() && i.customId == "voltar_id") {
            page--
            if(page == 0) {
                bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
                bnt1 = ButtonBuilder.from(bnt1).setDisabled(false)
            } else {
                bnt1 = ButtonBuilder.from(bnt1).setDisabled(false)
                bnt2 = ButtonBuilder.from(bnt2).setDisabled(false)
            }
            rowbnt = new ActionRowBuilder().addComponents(bnt2, bnt1)
            return interaction.editReply({ embeds: [getEmbedPage(page)], components: [rowbnt, rowmenu] })
          }  else if(i.isStringSelectMenu() && i.customId == "selector_help") {
            if(i.values.includes("1")) {
              page = 1
              bnt2 = ButtonBuilder.from(bnt2).setDisabled(false)
              bnt1 = ButtonBuilder.from(bnt1).setDisabled(false)
              rowbnt = new ActionRowBuilder().addComponents(bnt2, bnt1)
              interaction.editReply({ embeds: [getEmbedPage(1)], components: [rowbnt, rowmenu] })
            }
          }
      })

      collector.on('end', async i => {
        bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)
        bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)

        rowbnt = new ActionRowBuilder().addComponents(bnt2, bnt1)

        interaction.editReply({ embeds: [getEmbedPage(page)], components: [rowbnt] })
      })


      function getEmbedPage(page) {
        if(page == 0) {
          let embednew = new EmbedBuilder()
            .setTitle("Sistema de Ajuda")
            .setDescription(`${interaction.member}, *este é o meu menu de ajuda onde serão exibidos os meus comandos separados por categorias, eu sou um bot totalmente funcional e utilitário pronto para te ajudar, abaixo listo minha categorias e pra quais servem:* \n\n **__Categoria de Informações__** \n\n **Para ver os meus comandos passe a página pelos botões ou selecione diretamente a categoria na qual lhe interessa.** \n **Para ver o comando especificamente dê o comando \`/help nome_do_comando\`.**`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
          return embednew
        } else if(page == 1) {
          let embednew = new EmbedBuilder()
            .setTitle("Sistema de Ajuda")
            .setDescription(`${interaction.member}, *estamos agora na parte de categoria de **__Informações__** essa parte exibe os comandos para lhe informar de algo útil sobre mim/discord então abaixo eu listo os mesmos.* \n\n **__Comandos de Informações:__** \n \`${slashCommands.filter(command => command.category == "info").map(command => command.name).join('\`, \`')}\` \n\n **Para ver o comando especificamente dê o comando \`/help nome_do_comando\`.**`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
          return embednew
        }
      }
    } else {
      const name = commandzin.toLowerCase();
      const command = slashCommands.get(name)

      if (!command) {
          interaction.reply({ content: `${interaction.member}, o comando \`${name}\` não existe em minha lista de comandos.` })
          setTimeout(() => {
            interaction.deleteReply()
          }, 8000)
          return
      };

      data.push(`**Nome:** \`${command.name}\``);
      data.push(`**Descrição:** ${command.description}`);
      data.push(`**Cooldown:** \`${command.cooldown || 3} segundo(s)\``);

      const embedzin = new EmbedBuilder()
          .setTitle(`Ajuda sobre o \`${command.name}\``)
          .setDescription(data.join("\n"))
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setColor(color)
      return interaction.reply({ embeds: [embedzin] })
    }

  }
}
