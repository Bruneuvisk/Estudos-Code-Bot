

module.exports = {
  getClientDatabase: async function(client) {
    try {
      const cliente = await client.database.cliente.findOne({
        _id: client.user.id,
      })

      if(!cliente) {
        await client.database.cliente.create({
          _id: client.user.id,
        })

        return console.log("[AVISO - DB] Cliente criado com sucesso em meu banco de dados.");
      }

      return cliente
    } catch (e) {
      throw new Error(e);
    }
  },

  getGuildDatabase: async function(client, guild) {
    try {
      const servidor = await client.database.servidores.findOne({
        idServer: guild,
      })

      if(!servidor) {
        await client.database.servidores.create({
          idServer: guild,
        })

        return console.log("[AVISO - DB] Servidor criado com sucesso em meu banco de dados.");
      }

      return servidor
    } catch (e) {
      throw new Error(e);
    }
  },

  getUserDatabase: async function(client, member) {
    try {
      const membro = await client.database.members.findOne({
        idUser: member.id,
        tag: member.user.tag,
      })

      if(!membro) {
        await client.database.members.create({
          idUser: member.id,
          tag: member.user.tag,
        })

        return console.log("[AVISO - DB] Membro criado com sucesso em meu banco de dados.");
      }

      return membro
    } catch (e) {
      throw new Error(e);
    }
  },

  getComanndsDatabase: async function(client, SlashCommands) {
    try {
      const commands_db = await client.database.commands.findOne({
        _id: SlashCommands.name,
      });

      if(!commands_db) {
        console.log("Criando comando...")
        await client.database.commands.create({
          _id: SlashCommands.name,
          usages: 1,
          manuntencao: false,
          reason: 'null',
        })
        return console.log("[AVISO - DB] Comando criado com sucesso.")
      }

      return commands_db;
    } catch (e) {
      throw new Error(e)
    }
  }
}
