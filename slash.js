const { client } = require('./data.js')
const [ commands ] = require('./commands.js')
const { functions } = require('./data.js')


client.on('ready', async () => {
    console.log("Started")
    functions.update_status()
    functions.startReset()
   
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

