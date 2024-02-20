const { client } = require('./data.js')
const [ commands ] = require('./commands.js')
const { functions } = require('./data.js')
const { spawnSalmon } = require('./salmon.js')
const { sql, db } = require("./.database/sqlite.js")


client.on('ready', async () => {
    console.log("Started")
    functions.update_status()
})
client.on("messageCreate", async message => {
    if(checkBlockedList(message)) return;
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

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    console.log("Check Bellow")
    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if(await checkBlockedList(interaction)) {
        // If the channel is blocked, and the user is wanting to unlbock it, run command anyways
        if(command.name === "blockchannel") return command.command(interaction);
        else return interaction.reply("Channel is blocked");
    }
    console.log(commands)
    console.log(interaction.commandName)
    

    if (command) {
        console.log("Found Command!");

        if (command.needClient) {
            command.command(interaction, client);
        } else {
            command.command(interaction);
        }
    }

})

async function checkBlockedList(interaction) {
    let channel = await sql.GET(db, 'blacklistChannels', 'channelID', 'channelID', interaction.channelId)
    console.log(channel)
    if(channel) {
        console.log("Blocked")
        return true;
    }
    else return false;
}