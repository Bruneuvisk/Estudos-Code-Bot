// Importa várias classes e métodos do pacote discord.js para gerenciar interações e componentes
const { EmbedBuilder, Collection, WebhookClient, ChannelType, ButtonStyle, AttachmentBuilder, PermissionsBitField, InteractionType, ButtonBuilder, ActionRowBuilder, ButtonComponent, CommandInteraction, SelectMenuComponent, Client } = require("discord.js");
const { getClientDatabase, getGuildDatabase, getUserDatabase, getComanndsDatabase } = require("../Structures/Functions")
const Webhook = new WebhookClient({
  id: "1286286578536288257",
  token: "EGiCyvMjfgqa4kF1GKqZmmHyU0G7OGVf5c7FaT_lwhMe6uUIRNMnGt3-4MYqwfSU7B1n",
})
const cooldowns = new Collection()


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
      if (!SlashCommands) return;

      let prefix = client.config.prefix;
      let color = client.config.color;
      let config = client.config;

      if(interaction.channel.type === ChannelType.DM) {
        return await SlashCommands.run(client, interaction, config, prefix, color);
      }

      const cliente = await getClientDatabase(client)
      const server = await getGuildDatabase(client, interaction.guild.id)
      const membro = await client.database.members.findOne({
        idUser: interaction.member.id,
      })

      if(!membro) {
        await client.database.members.create({
          idUser: interaction.member.id,
          tag: interaction.member.user.tag,
        })
      }

      let blacklist_guilds = cliente.blacklistGuilds

      /*if(membro.tag !== interaction.member.user.tag) {
        await client.database.members.findOneAndUpdate(
          { idUser: interaction.member.id },
          { $set: { tag: interaction.member.user.tag } }
        )
      }*/


      // Obtém o prefixo, cor e configuração do bot a partir da configuração


      const now = Date.now()
      let timestamps = cooldowns.get(SlashCommands.name)

      if(!timestamps) {
        timestamps = new Map()
        cooldowns.get(SlashCommands.name, timestamps)
      }

      const cooldownAmount = (SlashCommands.cooldown || 3) * 1000

      if(timestamps.has(interaction.member.id)) {
        const expirationTime = timestamps.get(interaction.member.id) + cooldownAmount;

        if(now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          let embedtime = new EmbedBuilder()
            .setTitle(`Error de Tempo`)
            .setDescription(`${interaction.member}, Para realizar o comando \`${SlashCommands.name}\` você precisa aguardar cerca de \`${timeLeft.toFixed(1)} segundos\``)
          return interaction.reply({ ephemeral: true, embeds: [embedtime] })
        }
      }

      if(cliente.blacklistGuilds.some((x) => x.guild == interaction.guild.id)) {
        let blguilds = cliente.blacklistGuilds
        let arraymguilds = []
        blguilds.map((x) => arraymguilds.push(x.guild))
        let guildid = arraymguilds.indexOf(interaction.guild.id)
        let guild_real = blguilds[guildid]

        let embedmanu = new EmbedBuilder()
          .setDescription(`> ${interaction.member}, Então infelizmente este servidor está em minha \`Blacklist\`, mais informações abaixo: \n\n ${emojis.emojisetinha} | **__Motivo:__** \`${guild_real.reason}\` \n\n ${emojis.emojicerto} | **__Diante disso este servidor não poderá realizar nenhum comando meu, caso foi injusto entre no nosso [servidor de suporte](https://discord.gg/mised) e fale com nossos staffs.__**`)
        return interaction.reply({ ephemeral: true, embeds: [embedmanu] })
      }

      if(config.owner !== interaction.member.id) {
        if(cliente.manutencao) {
          let embedmanu = new EmbedBuilder()
            .setTitle(`Estudos Code Em Manuntenção`)
            .setDescription(`${interaction.member}, neste momento eu me encontro em manunteção pelo seguinte motivo: \`${cliente.reason}\` \n Caso queira saber mais entre em meu [servidor de suporte](https://discord.gg/mised) para saber o que ocorreu comigo.`)
          return interaction.reply({ ephemeral: true, embeds: [embedmanu] })
        }
      }

      /*if (channelses.length >= 1) {
        if (
          !channelses.includes(interaction.channel.id) &&
          !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
        ) {
          const arraycria = []

          await filterchannelsArray(client, channelses, arraycria, interaction)

          let embedzinho = new EmbedMised()
            .setTitle(`Error Canal`)
            .setDescription(
              `${interaction.member}, este comando não pode ser realizar neste canal, fui configurado somente parar realizar comandos nesse canais: \n ${arraycria.map((x) => `<#${x}>`).join(', ')}`
            )
          return interaction.reply({  ephemeral: true, embeds: [embedzinho] })
        }
      }
      if (cmdss.some((x) => x === SlashCommands.name)) {
        return interaction.reply({
          ephemeral: true, content: `${interaction.member}, o comando \`${SlashCommands.name}\` foi bloqueado de ser usado neste servidor.`,
        })
      }
      */

      if (SlashCommands.MemberPerm && !interaction.member.permissions.has(SlashCommands.MemberPerm)) {
        let permissions = []

        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.Administrator))
          permissions.push(`\`Administrador\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ViewAuditLog))
          permissions.push(`\`Ver o registro de auditoria\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageGuild))
          permissions.push(`\`Gerenciar Servidor\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageRoles))
          permissions.push(`\`Gerenciar Cargos\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageChannels))
          permissions.push(`\`Gerenciar Canais\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.KickMembers))
          permissions.push(`\`Expulsar Membros\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.BanMembers))
          permissions.push(`\`Banir Membros\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.CreateInstantInvite))
          permissions.push(`\`Criar Convite instantâneo\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ChangeNickname))
          permissions.push(`\`Alterar Apelido\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageNicknames))
          permissions.push(`\`Gerenciar Apelidos\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageEmojisAndStickers))
          permissions.push(`\`Gerenciar Emojis e Stickers\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageWebhooks))
          permissions.push(`\`Gerenciar Webhooks\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ViewChannel))
          permissions.push(`\`Ver Canais\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.SendMessages))
          permissions.push(`\`Enviar Mensagens\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.SendTTSMessages))
          permissions.push(`\`Enviar Mensagens TTS\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageMessages))
          permissions.push(`\`Gerenciar Mensagens\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.EmbedLinks))
          permissions.push(`\`Enviar Embeds\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.AttachFiles))
          permissions.push(`\`Enviar Arquivos\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ReadMessageHistory))
          permissions.push(`\`Ver o histórico de mensagens\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.MentionEveryone))
          permissions.push(`\`Marcar @everyone\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.UseExternalEmojis))
          permissions.push(`\`Usar Emojis Externos\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.AddReactions))
          permissions.push(`\`Adicionar Reações\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.Connect)) permissions.push(`\`Conectar\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.Speak)) permissions.push(`\`Falar\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.Stream)) permissions.push(`\`Transmitir Tela\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.MuteMembers))
          permissions.push(`\`Mutar Membros\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.DeafenMembers))
          permissions.push(`\`Ensurdecer Membros\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.MoveMembers))
          permissions.push(`\`Mover Membros\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.UseVAD)) permissions.push(`\`Usar Detecção de Voz\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.PrioritySpeaker))
          permissions.push(`\`Voz Prioritária\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ViewGuildInsights))
          permissions.push(`\`Ver as Informações do servidor\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.UseApplicationCommands))
          permissions.push(`\`Usar Comandos de /\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.RequestToSpeak))
          permissions.push(`\`Pedir pra falar\``)
        if (SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ManageThreads))
          permissions.push(`\`Gerenciar Conversas\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.ModerateMembers))
          permissions.push(`\`Colocar Membros de Castigo\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.UseEmbeddedActivities))
          permissions.push(`\`Iniciar Atividades Incorporadas\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.SendMessagesInThreads))
          permissions.push(`\`Enviar Mensagens em Tópicos\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.UseExternalStickers))
          permissions.push(`\`Usar Stickers Externos\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.CreatePublicThreads))
          permissions.push(`\`Criar Tópicos Públicos\``)
        if(SlashCommands.MemberPerm.includes(PermissionsBitField.Flags.CreatePrivateThreads))
          permissions.push(`\`Criar Tópicos Privados\``)

        let embedperms = new EmbedBuilder()
          .setTitle(`Error Permissões Membro`)
          .setDescription(`${interaction.member}, você não tem as permissões necessárias para realizar o comando \`${SlashCommands.name}\`. \n Permissões Necessárias: ${permissions.join(', ')}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        interaction.reply({  ephemeral: true, embeds: [embedperms] })
        permissions = []
        return
      }

      if (
        SlashCommands.ClientPerm &&
        !interaction.guild.members.cache.get(client.user.id).permissions.has(SlashCommands.ClientPerm)
      ) {
        let permissions = []

        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.Administrator))
          permissions.push(`\`Administrador\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ViewAuditLog))
          permissions.push(`\`Ver o registro de auditoria\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageGuild))
          permissions.push(`\`Gerenciar Servidor\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageRoles))
          permissions.push(`\`Gerenciar Cargos\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageChannels))
          permissions.push(`\`Gerenciar Canais\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.KickMembers))
          permissions.push(`\`Expulsar Membros\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.BanMembers))
          permissions.push(`\`Banir Membros\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.CreateInstantInvite))
          permissions.push(`\`Criar Convite instantâneo\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ChangeNickname))
          permissions.push(`\`Alterar Apelido\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageNicknames))
          permissions.push(`\`Gerenciar Apelidos\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageEmojisAndStickers))
          permissions.push(`\`Gerenciar Emojis e Stickers\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageWebhooks))
          permissions.push(`\`Gerenciar Webhooks\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ViewChannel))
          permissions.push(`\`Ver Canais\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.SendMessages))
          permissions.push(`\`Enviar Mensagens\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.SendTTSMessages))
          permissions.push(`\`Enviar Mensagens TTS\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageMessages))
          permissions.push(`\`Gerenciar Mensagens\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.EmbedLinks))
          permissions.push(`\`Enviar Embeds\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.AttachFiles))
          permissions.push(`\`Enviar Arquivos\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ReadMessageHistory))
          permissions.push(`\`Ver o histórico de mensagens\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.MentionEveryone))
          permissions.push(`\`Marcar @everyone\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.UseExternalEmojis))
          permissions.push(`\`Usar Emojis Externos\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.AddReactions))
          permissions.push(`\`Adicionar Reações\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.Connect)) permissions.push(`\`Conectar\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.Speak)) permissions.push(`\`Falar\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.Stream)) permissions.push(`\`Transmitir Tela\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.MuteMembers))
          permissions.push(`\`Mutar Membros\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.DeafenMembers))
          permissions.push(`\`Ensurdecer Membros\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.MoveMembers))
          permissions.push(`\`Mover Membros\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.UseVAD)) permissions.push(`\`Usar Detecção de Voz\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.PrioritySpeaker))
          permissions.push(`\`Voz Prioritária\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ViewGuildInsights))
          permissions.push(`\`Ver as Informações do servidor\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.UseApplicationCommands))
          permissions.push(`\`Usar Comandos de /\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.RequestToSpeak))
          permissions.push(`\`Pedir pra falar\``)
        if (SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ManageThreads))
          permissions.push(`\`Gerenciar Conversas\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.ModerateMembers))
          permissions.push(`\`Colocar Membros de Castigo\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.UseEmbeddedActivities))
          permissions.push(`\`Iniciar Atividades Incorporadas\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.SendMessagesInThreads))
          permissions.push(`\`Enviar Mensagens em Tópicos\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.UseExternalStickers))
          permissions.push(`\`Usar Stickers Externos\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.CreatePublicThreads))
          permissions.push(`\`Criar Tópicos Públicos\``)
        if(SlashCommands.ClientPerm.includes(PermissionsBitField.Flags.CreatePrivateThreads))
          permissions.push(`\`Criar Tópicos Privados\``)

        let embedperms = new EmbedBuilder()
          .setTitle(`Error Permissões Bot`)
          .setDescription(`${interaction.member}, o mised não tem as permissões necessárias para realizar o comando \`${SlashCommands.name}\`. \n ${emojis.emojisetinha} | Permissões Necessárias Pro Mised: ${permissions.join(', ')}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        interaction.reply({ ephemeral: true, embeds: [embedperms] })
        permissions = []
        return
      }

      if (
        SlashCommands.requiredroles &&
        SlashCommands.requiredroles.length > 0 &&
        interaction.member.roles.cache.size > 0 &&
        !interaction.member.roles.cache.some((r) => SlashCommands.requiredroles.includes(r.id))
      ) {
        let embedroles = new EmbedBuilder()
          .setTitle(`Error de Requerimentos de Cargos`)
          .setDescription(`${interaction.member}, para realizar este comando você precisa ter os cargos requisitados do comando \`${SlashCommands.name}\` \n Cargos Necessários: ${command && SlashCommands.requiredroles ? SlashCommands.requiredroles.map((v) => `<@&${v}>`).join(',') : `**__Nenhum Cargo__**`}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embedroles] })
      }

      if (
        SlashCommands.alloweduserids &&
        SlashCommands.alloweduserids.length > 0 &&
        !SlashCommands.alloweduserids.includes(interaction.member.id)
      ) {
        let embedmembers = new EmbedBuilder()
          .setTitle(`Error Usuários Permitidos`)
          .setDescription(`${interaction.member}, o comando \`${SlashCommands.name}\` só pode ser usado em minha lista de usuários permitidos. \n Usuários Permitidos: ${SlashCommands && SlashCommands.alloweduserids ? SlashCommands.alloweduserids.map((v) => `**${client.users.cache.get(v).tag}**`).join(', ') : `**__Nenhum Membro__**`}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embedmembers] })
      }

      const commands_db = await getComanndsDatabase(client, SlashCommands)

      var manu = false
      var reasonmanu = ""

      if(commands_db && commands_db.manuntencao == true) {
        manu = true
        reasonmanu = commands_db.reason
      }

      if(manu == true) {
        let embedmanu = new EmbedBuilder()
          .setTitle(`Comando Em Manuntenção`)
          .setDescription(`${interaction.member}, neste momento o comando \`${SlashCommands.name}\` se encontra em manuntanção pelo seguinte motivo: \`${reasonmanu}\` \n Caso queira saber mais entre em meu [servidor de suporte](https://discord.gg/mised) para saber o que ocorreu com o comando.`)
        return interaction.reply({ ephemeral: true, embeds: [embedmanu] })
      }

      timestamps.set(interaction.member.id, now);
      setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);

      try {
        // Executa o comando de barra
        await SlashCommands.run(client, interaction, config, prefix, color);
        var num = commands_db.usages;
        num = num + 1;
        await client.database.commands.findOneAndUpdate(
          {
            _id: SlashCommands.name,
          },
          { $set: {
            "usages": num
          } }
        );

        var num = cliente.totalUsos;
        num = num + 1;

        await client.database.cliente.findOneAndUpdate(
          {
            _id: client.user.id,
          },
          { $set: {
            "totalUsos": num
          } }
        );
        const EMBED_COMMANDS_SLASH = new EmbedBuilder()
          .setAuthor({ name: `Logs de Comandos de / do Bot`, iconURL: client.user.displayAvatarURL() })
          .addFields([
            {
              name: `Servidor que foi Usado`,
              value: `**${interaction.guild.name}** \`( ${interaction.guild.id} )\``,
            },
            {
              name: `Author do Comando`,
              value: `**${interaction.member.user.tag}** \`( ${interaction.member.id} )\``,
            },
            {
              name: `Data da Execução`,
              value: `<t:${Math.round(Date.now() / 1000)}:f> ( <t:${Math.round(Date.now() / 1000)}:R> )`,
            },
            {
              name: `Comando Executado`,
              value: `**\`${SlashCommands.name}\`**`,
            }
          ])
          .setColor(color)
          .setFooter({ text: interaction.member.id, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(client.user.displayAvatarURL({ format: "jpg", size: 2048 }));
        Webhook.send({ embeds: [EMBED_COMMANDS_SLASH] });
        timestamps.set(interaction.member.id, now);
        setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);
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
    async function filterchannelsArray(client, array, result, interaction) {
      for (const channel of array) {
        let channelfilter = await client.channels.cache.get(channel)

        if (!channelfilter) {
          await client.database.guilds.findOneAndUpdate(
            { idServer: interaction.guild.id },
            { $pull: { 'cmdblock.channels': channel } }
          )
          result.pull(channel)
          return
        }

        result.push(channelfilter.id)
      }
    }
  }
};
