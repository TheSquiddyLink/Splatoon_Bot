const [commands] = require('./commands.js')
const { REST, Routes } = require('discord.js')

const { readData } = require('./data.js')


const config = readData('./config/config2.json')

console.log(config)

const rest = new REST({ version: '10' }).setToken(config.discord.token);
(async () => {
  const serverIds = Object.keys(config.discord.servers);

for (const id of serverIds) {
  const server = config.discord.servers[id];
    console.log(server)
    try {
      console.log(commands)
      console.log(`Registering slash commands for ${server.name}`);

      await rest.put(
        Routes.applicationGuildCommands(
          config.discord.bot_id,
          id
        ),
        { body: commands }
      );

      console.log(`Slash commands registered successfully for ${server.name}!`);
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  }
  console.log("All commands registered!");

  process.exit();

})();
