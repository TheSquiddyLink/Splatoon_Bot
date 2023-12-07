const { client } = require('./data.js')
const [ commands ] = require('./commands.js')
const { functions } = require('./data.js')
const { spawnRandom } = require('./salmon.js')


client.on('ready', async () => {
    console.log("Started")
    functions.update_status()
    functions.startReset()
   
})
client.on("messageCreate", async message => {
    if (!message.author.bot){
        var msgrand = Math.random()
        msgrand = msgrand * 100
        msgrand = Math.round(msgrand)
        console.log(msgrand)
        if(msgrand >= 95){
            spawnRandom(message)
        }
    }
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    console.log(commands)
    console.log(interaction.commandName)
    for(i in commands){
        console.log(commands[i].name)
        if(commands[i].name === interaction.commandName){
            console.log("Found Command!")
            if(commands[i].needclient){
                commands[i].command(interaction, client)
            } else{
                commands[i].command(interaction)
            }
           
            break
        }
    }
})

