const { client } = require('./data.js')
const [ commands ] = require('./commands.js')
const { functions, data } = require('./data.js')
const { spawnSalmon } = require('./salmon.js')


client.on('ready', async () => {
    console.log("Started")
    functions.update_status()
})
client.on("messageCreate", async message => {
    if (!message.author.bot){
        var msgrand = Math.random()
        msgrand = msgrand * 100
        msgrand = Math.round(msgrand)
        console.log(msgrand)
        if(msgrand >= 95){
            spawnSalmon(message)
        }
    }
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if(checkBlockedList(interaction)) return interaction.reply("Channel is blocked")
    console.log(commands)
    console.log(interaction.commandName)
    const command = commands.find(cmd => cmd.name === interaction.commandName);

    if (command) {
        console.log("Found Command!");

        if (command.needClient) {
            command.command(interaction, client);
        } else {
            command.command(interaction);
        }
    }

})

function checkBlockedList(interaction) {
    let config = functions.readData(data.json.config)
    if(config.discord.servers[interaction.guildId].settings.blocked_channels.includes(interaction.channelId)) return true
    else return false
}