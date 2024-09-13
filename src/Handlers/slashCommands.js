const { readdirSync } = require("fs")
const { PermissionsBitField, Routes } = require("discord.js")
const { REST } = require("@discordjs/rest")


module.exports = async (client) => {
    const data = [];
    let count = 0;

    readdirSync("./src/SlashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"))

        for(const file of slashCommandFile) {
            const slashCommand = require(`../SlashCommands/${dir}/${file}`);

            if(!slashCommand.name) return client.logger.log(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`, "error")

            if(!slashCommand.description) return client.logger.log(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`, "error")

            client.slashCommands.set(slashCommand.name, slashCommand);

            data.push({
              name: slashCommand.name,
              description: slashCommand.description,
              type: slashCommand.type,
              options: slashCommand.options ? slashCommand.options : null,
              default_userPerms: slashCommand.default_permission ? slashCommand.default_permission : null,
              default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
            })
            count++
        };
    });
    client.logger.log(`Os ${count} comandos de (/) foram carregados com sucesso.`, "cmd")
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    try {
      client.logger.log('Começando o recarregamento dos comandos de (/)...', 'cmd')
      await rest.put(Routes.applicationCommands(client.config.clientID), { body: data })
      client.logger.log('Todos os comandos de (/) desta aplicação foram recarregados com sucesso.', 'cmd');
    } catch(error) {
      client.logger.log(error, "error")
    }
}
