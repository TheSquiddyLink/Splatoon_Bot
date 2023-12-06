const { ApplicationCommandOptionType } = require('discord.js');
const { data, functions } = require('./data.js')

const commands = [
  {
    name: 'ping',
    description: 'Pong!',
    needclient: false,
    command: pong
  },
  {
    name: 'event',
    description: 'get the active or future events',
    needclient: false,
    command: event
  },
  {
    name: 'leaderboard',
    description: 'get the leaderboard for splatfest or normal',
    needclient: true,
    options: [
      {
        name: 'type',
        description: 'type of leaderboard',
        type: ApplicationCommandOptionType.String,
        
        choices: [
          {
            name: 'event',
            value: 'event'
          },
          {
            name: 'normal',
            value: 'normal'
          }
        ],
        required: true,
      }
    ],
    command: leaderboard
  }
];



function leaderboard(message){
  let type = message.options._hoistedOptions[0].value
  let file
  if(type === "event"){
    file = data.files.splatfest
  } else {
    file = data.files.scores
  }
  functions.getusername(file).then(responce => {
    message.reply({
      "channel_id": `${message.channel.id}`,
      "content": "",
      "tts": false,
      "embeds": [
        {
          "type": "rich",
          "title": `Leaderboard!`,
          "description": responce,
          "color": 0x00FFFF
        }
      ]
    });
  });
}


function pong(message){
  message.reply("Ping!")
}

async function event(message){
  await functions.txtlookup(data.files.main_txt, "event_start").then(async(start) => {
    await functions.txtlookup(data.files.main_txt, "event_name").then(async(event) => {
      now = Math.floor(new Date().getTime() / 1000)
      console.log(`Now: ${now}`)
      if (start === "none"){
        message.reply("There are no upcoming events")
      } else {
        await functions.txtlookup(data.files.main_txt, "event_disc").then(async(disc) => {
          if (start < now){
            await functions.txtlookup(data.files.main_txt, "event_end").then(async(end) => {
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