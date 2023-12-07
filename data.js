const fs = require('fs');
const { config } = require('./config/config.js')
const readline = require('node:readline');
const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin, underscore } = require('discord.js');
const replaceInFile = require('replace-in-file/lib/replace-in-file');

const delay = ms => new Promise(res => setTimeout(res, ms));

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
      json: `./data.json`
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
  sm_states: [
    "<:Salmometer0:1144024236114071615>",
    "<:Salmometer1:1144024234264367155>",
    "<:Salmometer2:1144024233706532954>",
    "<:Salmometer3:1144024232502755368>",
    "<:Salmometer4:1144024229650645224>",
    "<:Salmometer5:1144024231542280342>"
  ],
  status_lines: 263,

  json: {
    global: "./global_data.json",
    user:  "./user_data.json"
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


  function removeitem(id, path, old){
    replacefile(path, old, id)
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
  async function addscales(type, id_list){
    let raw_data = readData(data.json.user)
    let user_scales = raw_data.scales
    for(i in id_list){
      console.log(id_list)  
    }

  }
  /*
  async function addscales(count, value, scale, id_list){
    while (count < value) {
      var id_val = Math.floor(Math.random() * id_list.length);
      console.log(`Added scale to ${id_list[id_val]}`);
      // var oldscale = await txtlookup(scale.file, id_val);
      let rawData = await readData(data.json.user)
      let oldscale = rawData.scales[] 
      var data = await fs.promises.readFile(scale.file, 'utf8');
  
      if (data.indexOf(id_list[id_val]) < 0) {
        console.log(`New: ${i}`);
        fs.appendFileSync(scale.file, `\n${id_list[id_val]} - ${value}`);
      } else {
        var newscale = Number(oldscale) + 1;
        console.log(`Replace: ${i}`);
        var updatedData = data.replace(`${id_list[id_val]} - ${oldscale}`, `${id_list[id_val]} - ${newscale}`);
        fs.writeFileSync(scale.file, updatedData, 'utf8');
      }
  
      count++;
    }
  }
  */

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
  /* 
  async function addstats(userid) {
    let stats = data.files.stats
    return new Promise((resolve, reject) => {
      fs.readFile(stats, async function (err, data) {
      if (err) reject(err);
      if(data.indexOf(userid) < 0){
        fs.appendFile(stats, `\n${userid} - 0| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | `, (err) => {
        if (err) reject(err);
        resolve();
        });
        } else {
      resolve();
        }
      });
    });
  }
  */

  function statsResponce(message, id){
    client.users.fetch(id).then(user => {
      if(!user.bot){
        let stats = data.files.stats
        let salmon = data.salmon
        fs.readFile(stats, function (err, data) {
          if (err) throw err;
          addStats(id).then(() => {
            txtlookup(stats, id).then(async (userstats) => {
              var newstats = userstats.split(" | ")
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
                message.reply({
                  "channel_id": `${message.channel.id}`,
                  "content": "",
                  "tts": false,
                  "embeds": [
                    {
                      "type": "rich",
                      "title": `Here is ${profilename.username}'s stats`,
                      "description": `${statmessage}`,
                      "color": 0x00FFFF
                    }
                  ]
                })
              })
            })
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

  async function replacefile(location, old, replaced){
    var options = {
      files: location,
      from: old,
      to: replaced,
    };
    replaceInFile.sync(options)
  }

  async function buyResponce(id, aviable, newgoldegg, item, message){
    goldeggemoji = data.emoji.goldeggemoji
    await replacefile(data.files.goldeneggs, `${id} - ${aviable}`, `${id} - ${newgoldegg}`).then(async () => {
    fs.readFile(item.file, async function (err, data) {
      if (err) throw err;
      if(data.indexOf(id) < 0){
        fs.appendFileSync(item.file, `\n${id} - ${1*item.mult}`)
        message.reply(`You now have ${goldeggemoji} ${newgoldegg} and **${1*item.mult}** ${item.name} `)
      }else {
        await txtlookup(item.file, id).then(async (old) => {
          await replacefile(item.file, `${id} - ${old}`, `${id} - ${Number(old) + 1}`)
          message.reply(`You now have ${goldeggemoji} **${newgoldegg}** and **${Number(old) + 1*item.mult}** ${item.name}`)
        })  
      }
    })
  })
  }

  async function setstatus(path, rand) {
    const fileStream = fs.createReadStream(path);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    rand = Math.random() * (data.status_lines - 0) + 0;
    rand = Math.round(rand)
    console.log(rand)
    var count2 = 0
    for await (const line2 of rl) {
      if (count2 === rand) {
        return line2
        
      } else {
        count2 = count2 + 1
      }
    }
  }
  
  async function update_status(){
    console.log("Stats")
    await setstatus(data.files.status).then(async (value) => {
      title = value.split(" SPLT274 ")[0]
      artist = value.split(" SPLT274 ")[1]
      album = value.split(" SPLT274 ")[2]
      duration = value.split(" SPLT274 ")[3]
      console.log(duration)
      duration = Number(duration) * 1000
      console.log(duration)
      console.log(value.replace("SPLT274", " - ").replace("SPLT274", " - ").replace("SPLT274", " - "))
      client.user.setPresence({ activities: [{ name: `${title}`, state: `${artist} ${album}`, type: 2 }]})
      await delay(duration);
      update_status()
    })
  }

  async function startReset(){
    console.log("Start Reset")
    let resetvars = data.resetvars
    let main_txt = data.files.main_txt
    for (i in resetvars) {
        console.log(`${i}`)
        await txtlookup(main_txt, resetvars[i].name).then((old) => {
        console.log(`thing: ${resetvars[i].name} - ${old}`)
        replacefile(main_txt, `${resetvars[i].name} - ${old}`, `${resetvars[i].name} - ${resetvars[i].value}`)
        })
    }
    let king_ids = data.files.king_ids
    fs.readFile(king_ids, async function(err, data) {
        replacefile(king_ids, data, "")
    })
    let cooldown = data.files.cooldown
    fs.readFile(cooldown, async function(err, data) {
        replacefile(cooldown, data, "")
    })
  }


  const functions = {
    txtlookup: txtlookup,
    getusername: getusername,
    getNthValue: getNthValue,
    buyResponce: buyResponce,
    statsResponce: statsResponce,
    readData: readData,
    writeData: writeData,
    replacefile: replacefile,
    update_status: update_status,
    startReset: startReset
  }

  const optional = {
    addStats: addStats,
    addscales: addscales,
    removeitem: removeitem,
    mode: mode,
  }
  client.login(config.discord.token);
  module.exports = { data, functions, client, delay, optional}