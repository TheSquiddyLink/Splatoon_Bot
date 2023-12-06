const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin } = require('discord.js');
const fs = require('fs');
const readline = require('node:readline');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
});

async function txtlookup(path, value) {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  var count = 0
  for await (const line of rl) {
    
    // Each line in input.txt will be successively available here as `line`.
      if (line.indexOf(value) >= 0) {
        console.log(line)
        var line2 = line.split(" - ")[1]
        return line2
      }
    } 
}
const main_txt = './tmp/test.txt'
const scores = './tmp/scores.txt'
const status = './tmp/status.txt'
const goldeneggs = './tmp/goldeneggs.txt'
const stats = './tmp/stats' 
const king_ids = './tmp/king_ids'
const cooldown = `./tmp/event/cooldown`
const splatfest = `./tmp/event/splatfest`
const status_lines = 263


const commands = [
    {
      name: 'ping',
      description: 'Pong!',
      command: pong
    },
    {
      name: 'event',
      description: 'get the active or future events',
      command: event
    }
  ];

  function pong(message){
    message.reply("Ping!")
  }

  async function event(message){
    await txtlookup(main_txt, "event_start").then(async(start) => {
      await txtlookup(main_txt, "event_name").then(async(event) => {
        now = Math.floor(new Date().getTime() / 1000)
        console.log(`Now: ${now}`)
        if (start === "none"){
          message.reply("There are no upcoming events")
        } else {
          await txtlookup(main_txt, "event_disc").then(async(disc) => {
            if (start < now){
              await txtlookup(main_txt, "event_end").then(async(end) => {
                if(end > now){
                  message.reply(`There is an active ${event}! it ends in <t:${end}:R> on <t:${end}:f> \n Event Discription: \n ${disc}`)
                } else {
                  message.reply("There are no upcoming events")
                }
              })
            }  else {
              message.reply(`Next event is a ${event}, it starts in <t:${start}:R> on <t:${start}:f> \n Event Discription: \n ${disc}`)
            }
          })
        }
      })
    })
  }
  module.exports = [ commands ];