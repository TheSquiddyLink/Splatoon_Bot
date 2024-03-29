const fs = require('fs');
const { config } = require('./config/config.js')
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms));

const data = {
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
    {name: "Booyah Bomb", value: "BB", use_splat: true, damge: 999,  emoji: "<:booyahbomb:1144839446278189137>", cost: 10, mult: 1, description: "Can one shot any salmon (Dose not work on King)", file: './tmp/shop_items/OneHitKO' },
    {name:"Killer Wail 5.1", value: "KW", use_splat: true, damge: 2,  emoji: "<:killerwail:1144840004963663993>", cost: 3, mult: 1, description: "Deal twice the damage! (Dose not work on miss)", file: './tmp/shop_items/doubledamage'},
    {name: "Wave Breaker", value: "WB", use_splat: false, emoji: "<:wavebreaker:1145026119389679716>", cost: 2, mult: 4, description: "Using this will force a salmon to spawn. !this will not bypass the cooldown!", file: './tmp/shop_items/instant_summon'}
  ],
  scales: [
    {name: "Bronze", emoji: "<:bronze_scale:1148995068548632576>"},
    {name: "Silver", emoji: "<:silver_scale:1148995066677952674>"},
    {name: "Gold", emoji: "<:gold_scale:1148995064379482302>"},
  ],

  salmon: {
    lesser_salmon: [
      {name: "Smallfry", health: 1, chance: 50, hitbox: 40, points: 1, emoji: "<:smallfry:1142682637018873876>", image: "https://media.discordapp.net/attachments/1116032437588340826/1143654495520313384/120px-S3_Smallfry_icon.png?width=240&height=240"},  
      {name: "Chum", health: 2, chance: 35, hitbox: 50, points: 2, emoji: "<:chum:1143398328571281509>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143654353014636624/120px-S3_Chum_icon.png?width=240&height=240"},  
      {name: "Cohock", health: 4, chance: 0, hitbox: 60, points: 4, emoji: "<:cohock:1143398327065509948>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143654352691658792/500.png?width=884&height=884"},  
    ],
    boss_salmon: [
      {name: "Big Shot", health: 8, chance: 91, timer: 0, bomb: false, hitbox: 90, points: 5, bonus: 0, emoji: "<:bigshot:1143636605307994254>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651512917164143/bigshot.png?width=300&height=300"},
      {name: "Drizzler", health: 4 , chance: 82, timer: 0, bomb: false, hitbox: 80, points: 5, bonus: 0, emoji: "<:drizzler:1143636603206635571>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651512594223284/drizzler.png?width=300&height=300"},
      {name: "Fish Stick", health: 3 , chance: 73, timer: 0, bomb: false, hitbox: 45, points: 5, bonus: 0,emoji: "<:fishstick:1143636601939955832>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651512199950346/fishstick.png?width=300&height=300"},
      {name: "Flipper Flopper", health: 1 , chance: 64, timer: 10, bomb: false, hitbox: 85, points: 5, bonus: 0,emoji: "<:flipperflopper:1143636599742148788>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651511944085564/flipperflopper.png?width=300&height=300"},
      {name: "Flyfish", health: 2 , chance: 55, timer: 10, bomb: true, hitbox: 40, points: 5, bonus: 0,emoji: "<:flyfish:1143636597766631527>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651463420194816/flyfish.png?width=300&height=300"},
      {name: "Maws", health: 1 , chance: 46, timer: 10, bomb: true, hitbox: 80, points: 5, bonus: 0,emoji: "<:maws:1143636596495753316>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651463155957900/maws.png?width=300&height=300"},
      {name: "Scrapper", health: 4 , chance: 37, timer: 0, bomb: false, hitbox: 90, points: 5, bonus: 0,emoji: "<:scrapper:1143636592871870475>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651462900088976/scrapper.png?width=300&height=300"},
      {name: "Slammin Lid", health: 2 , chance: 28, timer: 0, bomb: false, hitbox: 90, points: 5, bonus: 0,emoji: "<:slamminlid:1143636590854418543>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651462627471554/slamminlid.png?width=300&height=300"},
      {name: "Steel Eel", health: 3 , chance: 19, timer: 0, bomb: false, hitbox: 60, points: 5, bonus: 0,emoji: "<:steeleel:1143636589218648145>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651462342262914/steeleel.png?width=300&height=300"},
      {name: "Steelhead", health: 3 , chance: 10, timer: 10, bomb: false, hitbox: 70, points: 5, bonus: 0,emoji: "<:steelhead:1143636587838709780>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651462090588331/steelhead.png?width=300&height=300"},
      {name: "Stinger", health: 4 , chance: 2, timer: 10, bomb: false, hitbox: 85, points: 5, bonus: 0,emoji: "<:stinger:1143636585754132630>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143651461776027731/stinger.png?width=300&height=300"},
      {name: "Goldie", health: 4 , chance: 1, timer: 10, bomb: false, hitbox: 85, points: 5, bonus: 2,emoji: "<:goldie:1143398987479646308>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143654352255459348/120px-S3_Goldie_icon.png?width=240&height=240"},
    ],
    king_salmon: [
      {name: "Cohozuna", health: 2 , chance: 50, hitbox: 90, points: 100, emoji: "<:cohozuna:1145205344621039677>", image: "https://media.discordapp.net/attachments/1142680467825500264/1145209514388369418/S3_Cohozuna_icon.png?width=800&height=800"},
      {name: "Horrorboros", health: 2 , chance: 0, hitbox: 80, points: 100, emoji: "<:horrorboros:1145205346399420468>", image: "https://media.discordapp.net/attachments/1142680467825500264/1145209514153480283/S3_Horrorboros_icon.png?width=800&height=800"},
    ]
  },
  resetvars: [
    {name: "lesser",value: "none"},
    {name: "boss",value: "none"},
    {name: "king",value: "none"},
    {name: "health",value: "0"},
    {name: "cooldown",value: "false"},
  ],

  resetvarsJson: [
    {name: "lesser", parent: "salmon", value: "none"},
    {name: "boss", parent: "salmon", value: "none"},
    {name: "king", parent: "salmon", value: "none"},
    {name: "health", value: 0},
    {name: "cooldown", value: false},
    {name: "king_ids", value: []},
    {name: "cooldown", parent: "event", value: []}
  ],
  sm_states: [
    "<:Salmometer0:1144024236114071615>",
    "<:Salmometer1:1144024234264367155>",
    "<:Salmometer2:1144024233706532954>",
    "<:Salmometer3:1144024232502755368>",
    "<:Salmometer4:1144024229650645224>",
    "<:Salmometer5:1144024231542280342>"
  ],
  modes: [
    {
      name: "Turf War",
      value: "regular"
    },
    {
      name: "Anarchy Open",
      value: "open"
    },
    {
      name: "Anarchy Series",
      value: "series"
    },
    {
      name: "X Battle",
      value: "xbattle"
    },
    {
      name: "Salmon Run",
      value: "salmon"
    }
  ],

  modeValue: {
    regular: { 
      name: "Turf War",
      value: 0,
      image: "https://cdn.wikimg.net/en/splatoonwiki/images/thumb/e/ec/Symbol_TW_Splat.svg/1024px-Symbol_TW_Splat.svg.png?20160418203701"
    },
    open: {
      value: 1,
      name: "Anarchy Open",
      image: "https://cdn.wikimg.net/en/splatoonwiki/images/3/36/S_Ranked_Battle_Icon.png?20200427153346"
    },
    series: {
      value: 2,
      name: "Anarchy Series",
      image: "https://cdn.wikimg.net/en/splatoonwiki/images/3/36/S_Ranked_Battle_Icon.png?20200427153346"
    },
    xbattle: {
      value: 3,
      name: "X Battle",
      image: "https://cdn.wikimg.net/en/splatoonwiki/images/thumb/3/3e/S3_Icon_X_Battle.svg/2048px-S3_Icon_X_Battle.svg.png"
    },
    salmon: {
      value: 4,
      name: "Salmon Run",
      image: "https://cdn.wikimg.net/en/splatoonwiki/images/thumb/f/f0/SplatNet_3_icon_Salmon_Run.svg/2048px-SplatNet_3_icon_Salmon_Run.svg.png"
    }
  },
  rules: {
    "Tower Control": "https://cdn.wikimg.net/en/splatoonwiki/images/b/bc/S3_icon_Tower_Control.png",
    "Rainmaker": "https://cdn.wikimg.net/en/splatoonwiki/images/1/12/S3_icon_Rainmaker.png",
    "Splat Zones": "https://cdn.wikimg.net/en/splatoonwiki/images/3/38/S3_icon_Splat_Zones.png",
    "Clam Blitz": "https://cdn.wikimg.net/en/splatoonwiki/images/e/e3/S3_icon_Clam_Blitz.png"
  },
  status_lines: 263,

  json: {
    global: "json/global_data.json",
    user:  "json/user_data.json",
    status: "json/status.json"
  }
}
async function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    console.log(`${maxEl}, ${maxCount}`)
    return [maxEl, maxCount];
}

function readData(file) {
  try {
    const rawData = fs.readFileSync(file, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return an empty object
    return {}
  }
}

function writeData(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf-8');
}

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]
});


function toTimestamp(timeString){
  let time = new Date(timeString)
  let timeStamp = time.getTime() / 1000
  return(String(timeStamp))
}

  async function getusername(type){
    let userData = readData(data.json.user)

    let arr = userData[type]

    console.log(arr)

    const leaderboard = Object.entries(arr)
    leaderboard.sort((a, b) => b[1] - a[1])
    console.log(leaderboard)

    return new Promise(async (resolve, reject) => {
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
          a = leaderboard[i][0]
          console.log(String(a))
          await client.users.fetch(a).then(async (profilename) => {
            console.log(profilename)
            b = b.concat(`${leader_emoji} ${profilename.globalName} <${profilename.username}> - **${leaderboard[i][1]}**\n`)
        })
        }
        console.log(b)
        resolve(b);
  
    });
  }
  async function addscales(value, type, id_list){
    let raw_data = readData(data.json.user)
    let user_scales = raw_data.scales
    for(value > 0; value--;){
      let random_id = id_list[Math.floor(Math.random() * id_list.length)]
      if(raw_data.scales[random_id] === undefined){
        raw_data.scales[random_id] = 1
      }else{
        raw_data.scales[random_id]++
      }
    }

    return raw_data

  }

  async function addStats(userid){
    let rawData = await readData(data.json.user)
    console.log(rawData)
    let statsData = rawData.stats
    let syntax = statsData.syntax
    console.log(statsData.users)
    if(statsData.users[userid] === undefined){
      let newUserData = []
      for(i in syntax){
        newUserData[i] = 0
      }
      console.log("New Data:")
      console.log(newUserData)
      statsData.users[userid] = newUserData
      console.log(statsData.users)

      rawData.stats.users = statsData.users

      console.log("Final Data:")

      writeData(data.json.user, rawData)

    }

  }

  function statsResponce(message, id){
    userData = readData(data.json.user)
    client.users.fetch(id).then(user => {
      if(!user.bot){
        let salmon = data.salmon
          addStats(id).then(async () => {
              let newstats = userData.stats.users[id]
              var statmessage = ""
              var count = 0
              var type = ""
              for( i in newstats) {
                if(i == 17) {
                  break
                }
                if(i == 15){
                  count = 0
                  statmessage = `${statmessage}═════════════\n` 
                }
                if(i == 3) {
                  count = 0
                  statmessage = `${statmessage}═════════════\n` 
                }
                if(i >= 3) {
                  if (i >= 15){
                    console.log("King!")
                    type = salmon.king_salmon
                  } else
                    type = salmon.boss_salmon
                } else{
                  type =  salmon.lesser_salmon 
              }
                statmessage = `${statmessage}${type[count].emoji}${type[count].name} | ${newstats[i]}\n`
                count = count + 1
              }
              await client.users.fetch(id).then(async (profilename) => {
                console.log(profilename)
                let embed = new EmbedBuilder()
                .setTitle(`Here is ${profilename.username}'s stats`)
                .setDescription(`${statmessage}`)
                .setColor(0x00FFFF)

                message.reply({embeds: [embed]})
              })
          })
      } else {
        message.reply("User provided is a bot")
      }
    })
    
  }

  function getNthValue(message, n){
    try{
      return message.options._hoistedOptions[n].value
    }
    catch(err) {
      console.log(err.message)
      return message.user.id
    }
    
  }


  async function buyResponce(id, newgoldegg, item, message){
    console.log(item.value)
    let userData = await readData(data.json.user)
    goldeggemoji = data.emoji.goldeggemoji

    userData.goldeneggs[id] = newgoldegg
    let current = userData.shop_items[item.value][id]
    if(userData.shop_items[item.value][id] === undefined){
      userData.shop_items[item.value][id] = 1
      current = 1
    } else {
      userData.shop_items[item.value][id] = userData.shop_items[item.value][id] + 1
      current++
    }

    
    message.reply(`You now have ${goldeggemoji} ${newgoldegg} and **+${1*item.mult} (${current})** ${item.name} `)
    writeData(data.json.user, userData)
  }
  
  async function update_status(){
    console.log("Update Status")
    let status = await readData(data.json.status)

    let length = status.length
    console.log

    let rand = Math.random() * (length)
    rand = rand.toFixed(0)
    console.log(rand)

    let value = status[rand]

    let title = value.title
    let artist = value.artist
    let album = value.album
    let duration = value.duration

    console.log(duration)
    duration = Number(duration) * 1000

    client.user.setPresence({ activities: [{ name: `${title}`, state: `${artist} ${album}`, type: 2 }]})
    await delay(duration);
    update_status()
  }

  async function startReset(){
    console.log("Start Reset")
    let globalData = await readData(data.json.global)
    console.log(globalData)
    for(i in data.resetvarsJson){
      console.log(data.resetvarsJson[i].parent)
      if(data.resetvarsJson[i].parent){
        console.log("Using Parent")
        globalData[data.resetvarsJson[i].parent][data.resetvarsJson[i].name] = data.resetvarsJson[i].value 
      } else {
        globalData[data.resetvarsJson[i].name] = data.resetvarsJson[i].value
      }
    }
    console.log(globalData)
    writeData(data.json.global, globalData)
    console.log("Reset Complete")
  }


  const functions = {
    getusername: getusername,
    getNthValue: getNthValue,
    buyResponce: buyResponce,
    statsResponce: statsResponce,
    readData: readData,
    writeData: writeData,
    update_status: update_status,
    startReset: startReset,
    toTimestamp: toTimestamp
  }

  const optional = {
    addStats: addStats,
    addscales: addscales,
    mode: mode,
  }
  client.login(config.discord.token);
  module.exports = { data, functions, client, delay, optional}