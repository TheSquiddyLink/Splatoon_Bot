const fs = require('fs');
const { config } = require('./config/config.js')
const readline = require('node:readline');
const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin } = require('discord.js');
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
  async function scorestotuple(path) {
    const fileStream = fs.createReadStream(path);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var count = 0
    var allscores = [{name: "0",score: "0"}]
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      var name2 =line.split(" - ")[0]
      var score2 =line.split(" - ")[1]
      console.log(name2)
      console.log(score2)
      allscores.push({name: name2,score: score2})
      }
    allscores.shift()
    allscores.sort((a, b) => Number(b.score) - Number(a.score))
    return allscores
  } 

  async function getusername(path){
    return new Promise((resolve, reject) => {
    scorestotuple(path).then(async (leaderboard) => {
      console.log(leaderboard)
      var b = ""
      for (let i = 0; i < leaderboard.length; i++){
        var leader_emoji
        if(leaderboard.length > 0 && i == 0){
          leader_emoji = `:first_place:`
        } else if (i == 1 && leaderboard.length > 1){
          leader_emoji = `:second_place:`
        } else if(i == 2 && leaderboard.length > 2) {
          leader_emoji = `:third_place:`
        } else {
          leader_emoji = `${i + 1}  -  `
        }
          a = leaderboard[i].name
          console.log(String(a))
          await client.users.fetch(a).then(async (profilename) => {
            console.log(profilename)
            b = b.concat(`${leader_emoji} ${profilename.globalName} <${profilename.username}> - **${leaderboard[i].score}**\n`)
        })
        }
        console.log(b)
        resolve(b);
  
    });
    })
  }
  const data = {
    files: {
        main_txt: './tmp/test.txt',
        scores: './tmp/scores.txt',
        status: './tmp/status.txt',
        goldeneggs: './tmp/goldeneggs.txt',
        stats: './tmp/stats' ,
        king_ids: './tmp/king_ids',
        cooldown: `./tmp/event/cooldown`,
        splatfest: `./tmp/event/splatfest`,
    },
    emoji: {
      sm_states: [
        "<:Salmometer0:1144024236114071615>",
        "<:Salmometer1:1144024234264367155>",
        "<:Salmometer2:1144024233706532954>",
        "<:Salmometer3:1144024232502755368>",
        "<:Salmometer4:1144024229650645224>",
        "<:Salmometer5:1144024231542280342>"
      ],   
      splatemoji: "<:splat:1143639892061069444>",
      goldeggemoji: "<:goldenegg:1143640722701041704>",
      powereggemoji: "<:poweregg:1144835063905787964>",
      staff: "<:staff:1144840625406083123>",
    },
    shop_items: [
      {name: "Booyah Bomb", use: "BB", emoji: "<:booyahbomb:1144839446278189137>", cost: 10, mult: 1, discription: "Can one shot any salmon (Dose not work on King)", file: './tmp/shop_items/OneHitKO' },
      {name:"Reef Slider", use: "RS", emoji: "<:reefslider:1144839763011063808>", cost: 1, mult: 4, discription: "Splat the salmon without needing to type it's name!", file: './tmp/shop_items/fastsplat'},
      {name:"Killer Wail 5.1", use: "KW", emoji: "<:killerwail:1144840004963663993>", cost: 3, mult: 1, discription: "Deal twice the damage! (Dose not work on miss)", file: './tmp/shop_items/doubledamage'},
      {name: "Wave Breaker", use: "WB", emoji: "<:wavebreaker:1145026119389679716>", cost: 2, mult: 4, discription: "Using this will force a salmon to spawn. !this will not bypass the cooldown!", file: './tmp/shop_items/instant_summon'}
    ],
    status_lines: 263
  }

  const functions = {
    txtlookup: txtlookup,
    getusername: getusername
  }
  client.login(config.discord.token);
  module.exports = { data, functions, client }