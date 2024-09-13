// Importa as classes e métodos necessários do pacote discord.js
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

// Define a classe customizada EstudosCode que estende a classe Client do Discord.js
class EstudosCode extends Client {

    // O construtor inicializa o cliente com as intenções e parciais especificadas
    constructor() {
        // Chama o construtor da classe base (Client) passando as intenções e parciais
        super({
            intents: [
                // Lista de intenções (Intents) para controlar o que o bot pode acessar no servidor
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.DirectMessagePolls,
                GatewayIntentBits.GuildMessagePolls,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildScheduledEvents
            ],
            // Define os dados parciais que o bot poderá receber, como mensagens e membros
            partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
        });

        // Coleção para armazenar os comandos de barra (/commands) do bot
        this.slashCommands = new Collection();

        // Carrega as configurações do bot a partir de um arquivo JSON
        this.config = require("../Interfaces/config.json");

        // Coleção para armazenar dados personalizados
        this.database = new Collection();

        // Logger customizado para registrar informações no console
        this.logger = require("./Logger");

        // Coleção para armazenar os comandos gerais do bot
        this.commands = new Collection();

        // Caso o token não tenha sido definido, ele será recuperado do arquivo de configuração
        if (!this.token) this.token = this.config.token;

        // Ouvinte para eventos de limite de requisições (rateLimit)
        this.rest.on('rateLimited', (info) => {
          // Registra um log quando o limite de requisições é atingido
          this.logger.log("rateLimit", "log");
        });
    }

    // Método para conectar o bot ao Discord utilizando o token
    connect() {
        return super.login(this.token);
    }
}

// Exporta a classe EstudosCode para ser utilizada em outros arquivos
module.exports = EstudosCode;
