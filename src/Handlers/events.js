// Importa a função 'readdirSync' do módulo 'fs' para ler diretórios e arquivos
const { readdirSync } = require("fs");

// Exporta uma função que carrega e registra eventos para o cliente
module.exports = (client) => {
  // Contador para rastrear quantos eventos foram carregados
  let count = 0;

  // Lê todos os arquivos dentro do diretório 'Events'
  readdirSync("./src/Events/").forEach(file => {
    // Importa o módulo do evento baseado no nome do arquivo
    const event = require(`../Events/${file}`);

    // Registra um ouvinte de evento para o nome do evento importado
    // A função 'run' do evento é chamada quando o evento é emitido
    client.on(event.name, (...args) => event.run(client, ...args));

    // Incrementa o contador de eventos carregados
    count++;
  });

  // Loga no console que os eventos foram carregados com sucesso
  client.logger.log(`Os ${count} eventos foram carregados com sucesso.`, "event");
}
