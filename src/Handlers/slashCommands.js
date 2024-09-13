// Importa a função 'readdirSync' do módulo 'fs' para ler diretórios e arquivos
const { readdirSync } = require("fs");

// Importa 'PermissionsBitField' e 'Routes' do discord.js para gerenciar permissões e rotas de API
const { PermissionsBitField, Routes } = require("discord.js");

// Importa a classe 'REST' da biblioteca '@discordjs/rest' para interagir com a API do Discord
const { REST } = require("@discordjs/rest");

// Exporta a função assíncrona para carregar e registrar comandos de barra (/) no bot
module.exports = async (client) => {
    // Array para armazenar os dados dos comandos
    const data = [];

    // Contador para rastrear quantos comandos de barra são carregados
    let count = 0;

    // Lê todos os diretórios dentro de 'SlashCommands' e percorre cada um deles
    readdirSync("./src/SlashCommands/").forEach((dir) => {
        // Filtra os arquivos JavaScript (.js) dentro de cada subdiretório
        const slashCommandFile = readdirSync(`./src/SlashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

        // Percorre cada arquivo de comando encontrado
        for (const file of slashCommandFile) {
            // Importa o comando
            const slashCommand = require(`../SlashCommands/${dir}/${file}`);

            // Verifica se o comando tem um nome, caso contrário, registra um erro no logger
            if (!slashCommand.name)
                return client.logger.log(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`, "error");

            // Verifica se o comando tem uma descrição, caso contrário, registra um erro no logger
            if (!slashCommand.description)
                return client.logger.log(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`, "error");

            // Armazena o comando no client (na coleção 'slashCommands')
            client.slashCommands.set(slashCommand.name, slashCommand);

            // Prepara os dados do comando para serem enviados para a API do Discord
            data.push({
              name: slashCommand.name, // Nome do comando
              description: slashCommand.description, // Descrição do comando
              type: slashCommand.type, // Tipo do comando
              options: slashCommand.options ? slashCommand.options : null, // Opções do comando (se houver)
              default_userPerms: slashCommand.default_permission ? slashCommand.default_permission : null, // Permissões padrão do usuário (se houver)
              default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null // Permissões do membro (se houver)
            });

            // Incrementa o contador de comandos carregados
            count++;
        };
    });

    // Registra no logger que os comandos de barra foram carregados com sucesso
    client.logger.log(`Os ${count} comandos de (/) foram carregados com sucesso.`, "cmd");

    // Cria uma instância da classe REST para interagir com a API do Discord usando a versão 10
    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
        // Log informando que o processo de recarregamento dos comandos começou
        client.logger.log('Começando o recarregamento dos comandos de (/)...', 'cmd');

        // Faz uma requisição para registrar ou atualizar todos os comandos de barra da aplicação no Discord
        await rest.put(Routes.applicationCommands(client.config.clientID), { body: data });

        // Log informando que todos os comandos de barra foram recarregados com sucesso
        client.logger.log('Todos os comandos de (/) desta aplicação foram recarregados com sucesso.', 'cmd');
    } catch (error) {
        // Caso haja um erro durante o processo, ele será registrado no logger
        client.logger.log(error, "error");
    }
};
