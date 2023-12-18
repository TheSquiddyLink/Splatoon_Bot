const { config } = require('./config/config.js')
const [ commands ] = require('./commands.js')
const { REST, Routes } = require('discord.js')



const rest = new REST({ version: '10' }).setToken(config.discord.token);
(async () => {
  for(i in config.discord.server){
    try {
      console.log(commands)
      console.log('Registering slash commands...');
  
      await rest.put(
        Routes.applicationGuildCommands(
          config.discord.bot_id,
          config.discord.server[i].id
        ),
        { body: commands }
      );
  
      console.log(`Slash commands were registered successfully for server ${config.discord.server[i].name}`);
    } catch (error) {
      console.log(`There was an error for ${config.discord.server[i].name}: ${error}`);
    }
  }

})();

