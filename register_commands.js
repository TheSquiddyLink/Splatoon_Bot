const { config } = require('./config/config.js')
const [ commands ] = require('./commands.js')
const { REST, Routes } = require('discord.js')



const rest = new REST({ version: '10' }).setToken(config.discord.token);
(async () => {
  for (const server of config.discord.server) {
    try {
      console.log(commands)
      console.log(`Registering slash commands for ${server.name}`);

      await rest.put(
        Routes.applicationGuildCommands(
          config.discord.bot_id,
          server.id
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


