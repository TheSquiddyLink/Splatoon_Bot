const { config } = require('./config/config.js')
const [ commands ] = require('./commands.js')
const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin } = require('discord.js');
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
});
client.on('ready', async () => {
    console.log("Started")
})

function test(){
    console.log("Testing")
}

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    console.log(commands)
    console.log(interaction.commandName)
    for(i in commands){
        console.log(commands[i].name)
        if(commands[i].name === interaction.commandName){
            console.log("Found Command!")
            commands[i].command(interaction)
            break
        }
    }
})

client.login(config.discord.token);