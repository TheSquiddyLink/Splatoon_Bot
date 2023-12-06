const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin } = require('discord.js');
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
});

const commands = [
    {
      name: 'hey',
      description: 'Replies with hey!',
      command: test
    },
    {
      name: 'ping',
      description: 'Pong!',
      command: test2
    },
  ];

  function test(data){
    console.log(data)
    data.reply("Test")
  }

  function test2(data){
    console.log("Running Test 2")
  }

  module.exports = [ commands ];