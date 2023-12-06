const { profile, count } = require('console');
const { config } = require('./config/config.js')
const { Client, GatewayIntentBits, ApplicationCommandNumericOptionMinMaxValueMixin } = require('discord.js');
const fs = require('fs');
const readline = require('node:readline');
const replace = require('replace-in-file');
const replaceInFile = require('replace-in-file/lib/replace-in-file');

const main_txt = './tmp/test.txt'
const scores = './tmp/scores.txt'
const status = './tmp/status.txt'
const goldeneggs = './tmp/goldeneggs.txt'
const stats = './tmp/stats' 
const king_ids = './tmp/king_ids'
const cooldown = `./tmp/event/cooldown`
const splatfest = `./tmp/event/splatfest`
const status_lines = 263

const sm_states = [
  "<:Salmometer0:1144024236114071615>",
  "<:Salmometer1:1144024234264367155>",
  "<:Salmometer2:1144024233706532954>",
  "<:Salmometer3:1144024232502755368>",
  "<:Salmometer4:1144024229650645224>",
  "<:Salmometer5:1144024231542280342>"
]
const scales = [
  {name: "Bronze", emoji: "<:bronze_scale:1148995068548632576>",  file: './tmp/scales/bronze'},
  {name: "Silver", emoji: "<:silver_scale:1148995066677952674>",  file: './tmp/scales/silver'},
  {name: "Gold", emoji: "<:gold_scale:1148995064379482302>",  file: './tmp/scales/gold'},
]

const splatemoji = "<:splat:1143639892061069444>"
const goldeggemoji = "<:goldenegg:1143640722701041704>"
const powereggemoji = "<:poweregg:1144835063905787964>"
const staff = "<:staff:1144840625406083123>"

var shop_items = [
  {name: "Booyah Bomb", use: "BB", emoji: "<:booyahbomb:1144839446278189137>", cost: 10, mult: 1, discription: "Can one shot any salmon (Dose not work on King)", file: './tmp/shop_items/OneHitKO' },
  {name:"Reef Slider", use: "RS", emoji: "<:reefslider:1144839763011063808>", cost: 1, mult: 4, discription: "Splat the salmon without needing to type it's name!", file: './tmp/shop_items/fastsplat'},
  {name:"Killer Wail 5.1", use: "KW", emoji: "<:killerwail:1144840004963663993>", cost: 3, mult: 1, discription: "Deal twice the damage! (Dose not work on miss)", file: './tmp/shop_items/doubledamage'},
  {name: "Wave Breaker", use: "WB", emoji: "<:wavebreaker:1145026119389679716>", cost: 2, mult: 4, discription: "Using this will force a salmon to spawn. !this will not bypass the cooldown!", file: './tmp/shop_items/instant_summon'}
]

var lesser_salmon = [
  {name: "Smallfry", health: 1, chance: 50, hitbox: 40, points: 1, emoji: "<:smallfry:1142682637018873876>", image: "https://media.discordapp.net/attachments/1116032437588340826/1143654495520313384/120px-S3_Smallfry_icon.png?width=240&height=240"},  
  {name: "Chum", health: 2, chance: 35, hitbox: 50, points: 2, emoji: "<:chum:1143398328571281509>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143654353014636624/120px-S3_Chum_icon.png?width=240&height=240"},  
  {name: "Cohock", health: 4, chance: 0, hitbox: 60, points: 4, emoji: "<:cohock:1143398327065509948>", image: "https://media.discordapp.net/attachments/1142680467825500264/1143654352691658792/500.png?width=884&height=884"},  
]

var boss_salmon = [
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

]

var king_salmon = [
  {name: "Cohozuna", health: 20 , chance: 50, hitbox: 90, points: 100, emoji: "<:cohozuna:1145205344621039677>", image: "https://media.discordapp.net/attachments/1142680467825500264/1145209514388369418/S3_Cohozuna_icon.png?width=800&height=800"},
  {name: "Horrorboros", health: 15 , chance: 0, hitbox: 80, points: 100, emoji: "<:horrorboros:1145205346399420468>", image: "https://media.discordapp.net/attachments/1142680467825500264/1145209514153480283/S3_Horrorboros_icon.png?width=800&height=800"},
]
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const resetvars = [
  {name: "lesser",value: "none"},
  {name: "boss",value: "none"},
  {name: "king",value: "none"},
  {name: "health",value: "0"},
  {name: "cooldown",value: "false"},
]
async function replacefile(location, old, replaced){
  var options = {
    files: location,
    from: old,
    to: replaced,
  };
  replaceInFile.sync(options)

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

async function addscales(count, value, scale, id_list){
  while (count < value) {
    var id_val = Math.floor(Math.random() * id_list.length);
    console.log(`Added scale to ${id_list[id_val]}`);
    var oldscale = await txtlookup(scale.file, id_val);
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
async function spawnsalmon(type, message){
  txtlookup(main_txt, 'salmon_meter').then((salmon_meter) => {
    kingrand = Math.round(Math.random() * 200)
    console.log(salmon_meter)
    if(salmon_meter === "100"){
      var gldegg = 5 
      console.log("Spawning King")
        for(i in king_salmon) {
          if (kingrand >= king_salmon[i].chance) {
            message.channel.send({
                          
              "channel_id": `${message.channel.id}`,
              "content": "",
              "tts": false,
              "embeds": [
                {
                  "type": "rich",
                  "title": `A ${king_salmon[i].name} spawned!`,
                  "description": `Health: ${king_salmon[i].health}\nGolden Eggs: ${goldeggemoji} ${gldegg}\nPower Eggs: ${powereggemoji} ${king_salmon[i].points}\n\nSay \`!splat ${king_salmon[i].name}\` to attack it`,
                  "color": 0xfa8124,
                  "image": {
                    "url": `${king_salmon[i].image}`,
                    "height": 0,
                    "width": 0
                  },
                }
              ]
            })
            replacefile(main_txt, "king - none", `king - ${i}`)
            replacefile(main_txt, "health - 0", `health - ${king_salmon[i].health}`)
            replacefile(main_txt, "salmon_meter - 100", `salmon_meter - 0`)
            break
          }
        } 
    } else {
      txtlookup(main_txt, "lesser").then(async (current) => {
        console.log(current)
        if (current === "none") {
          txtlookup(main_txt, "boss").then(async (current) => {
            console.log(current)
            if (current === "none") {
              txtlookup(main_txt, "king").then(async (current) => {
                if (current === "none") {
                  txtlookup(main_txt, "cooldown").then(async (cooldown) => {
                    if(cooldown === "false"){
                      var rand = Math.random()
                      var rand = rand*100
                      var rand = Math.round(rand)
                      console.log(rand)
                      if (type === "boss"){
                        salmon = boss_salmon
                        gldegg = "0-3"
                      } 
                      if (type === "lesser") {
                        salmon = lesser_salmon
                        gldegg = "0"
                      }
                      
                      for (i in salmon){
                        console.log(salmon[i].chance)
                        if (rand >= salmon[i].chance){
                          await txtlookup(main_txt, "reaction_only").then((value) => {
                            console.log(`Value: ${value}`)
                            if (value === "true") {
                              console.log("Reacting...")
                              message.react(salmon[i].emoji)
                              if (type === "boss"){
                                message.react(goldeggemoji)
                              }
                            
                            } else {
                              txtlookup(main_txt, "salmon_meter").then(async (salmon_meter) => {
                                console.log(parseFloat(salmon_meter))
                                var salmon_meter2 = parseFloat(salmon_meter) + parseFloat((Math.random()*5))
                                salmon_meter2 = salmon_meter2.toFixed(2)
                                var salmon_state = 0
                                var track = 0
                                while (track <= 5) {
                                  if(parseFloat(salmon_meter2) <= ((16.66) * (track + 1))){
                                    salmon_state = track
                                    break
                                  }
                                  track++
                                  console.log(track)
                                }
                                if (salmon_meter2 >= 100){
                                  salmon_meter2 = 100
                                  await replacefile(main_txt, `salmon_meter - ${salmon_meter}`, `salmon_meter - 100`)
                                } else {
                                  await replacefile(main_txt, `salmon_meter - ${salmon_meter}`, `salmon_meter - ${salmon_meter2}`)
                                }
                                message.channel.send({
                                  
                                  "channel_id": `${message.channel.id}`,
                                  "content": "",
                                  "tts": false,
                                  "embeds": [
                                    {
                                      "type": "rich",
                                      "title": `A ${salmon[i].name} spawned!`,
                                      "description": `Health: ${salmon[i].health}\nGolden Eggs: ${goldeggemoji} ${gldegg}\nPower Eggs: ${powereggemoji} ${salmon[i].points}\n\nSay \`!splat ${salmon[i].name}\` to attack it`,
                                      "color": 0xfa8124,
                                      "image": {
                                        "url": `${salmon[i].image}`,
                                        "height": 0,
                                        "width": 0
                                      },
                                      "fields": [
                                        {
                                          "name": `Salmon Meter:`,
                                          "value": `${sm_states[salmon_state]}${salmon_meter2}%`
                                        }
                                      ],
                                    }
                                  ]
                                })
                              })
            
                            }
                            replacefile(main_txt, `${type} - none`, `${type} - ${i}`)
                            replacefile(main_txt, `health - 0`, `health - ${salmon[i].health}`)
            
                          })
                          console.log("Timer Started")
                          replacefile(main_txt, "cooldown - false", "cooldown - true")
                          await delay(60000)
                          console.log("Timer Ended")
                          replacefile(main_txt, "cooldown - true", "cooldown - false")
                          txtlookup(main_txt, "lesser").then((value) => {
                              txtlookup(main_txt, "boss").then((value2) => {
                                if ((!(value === "none")) || (!(value2 === "none"))) {
                                  message.channel.send(`The ${salmon[i].name} got away :(` )
                                  replacefile(main_txt, `lesser - ${i}`, `lesser - none`)
                                  replacefile(main_txt, `boss - ${i}`, `boss - none`)
                                  txtlookup(main_txt, "health").then((health) => {
                                    replacefile(main_txt, `health - ${health}`, `health - 0`)
                                  })
                                }
                              })
                          })
                          break
                        }
                      }
                    } else {
                      message.channel.send("Unable to spawn salmon, on cooldown")
                    }
                  }) 
                } else {
                  message.reply("There is already a king salmon")
                }

              })
              
            } else {
              message.reply("There is already a boss salmon")
            }
          })
        } else {
          message.reply("there is already a lesser salmon")
        }
      })
    }
  })
}



async function addstats(userid) {
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
async function idtoarray(path) {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  var count = 0
  var allscores = []
  for await (const line of rl) {
    allscores.push(line)
  }
  allscores.shift()
  console.log("Look bellow here ☺")
  console.log(allscores)
  return allscores
} 
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

async function setstatus(path, rand) {
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  rand = Math.random() * (status_lines - 0) + 0;
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
  await setstatus(status).then(async (value) => {
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
const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  update_status()
  for (i in resetvars) {
    console.log(`${i}`)
    await txtlookup(main_txt, resetvars[i].name).then((old) => {
      console.log(`thing: ${resetvars[i].name} - ${old}`)
      replacefile(main_txt, `${resetvars[i].name} - ${old}`, `${resetvars[i].name} - ${resetvars[i].value}`)
    })
  }
  fs.readFile(king_ids, async function(err, data) {
    replacefile(king_ids, data, "")
  })
  fs.readFile(cooldown, async function(err, data) {
    replacefile(cooldown, data, "")
  })

});

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


client.on("messageCreate", async message => {

  if (!message.author.bot){
    if(message.content === "!event"){
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
    txtlookup(main_txt, "event_start").then(async(start) => {
      txtlookup(main_txt, "event_end").then(async(end) => {
        txtlookup(main_txt, "event_name").then(async(event) => {
          now = Math.floor(new Date().getTime() / 1000)
          if(((start <= now) &&( now <= end)) && event != "none"){
            fs.readFile(cooldown, async function (err, data) {
            if (err) throw err;
            if(data.indexOf(message.author.id) < 0){
              fs.readFile(splatfest, async function (err, data) {
                if (err) throw err;
                if(data.indexOf(message.author.id) < 0){
                  fs.appendFileSync(splatfest, `${message.author.id} - 10\n`)
                } else{
                  txtlookup(splatfest, message.author.id).then(async(old_score) => {
                    replacefile(splatfest, `${message.author.id} - ${old_score}`, `${message.author.id} - ${Number(old_score) + 10}`)
                  })
                }
              })
              fs.appendFileSync(cooldown, `${message.author.id}\n`)
              console.log("Added cooldown")
              await delay(60000);
              replacefile(cooldown,`${message.author.id}\n`, "")
              console.log("Removed")
            }
          })
          }
          
        })
      })
    })

    var msgrand = Math.random()
  msgrand = msgrand * 100
  msgrand = Math.round(msgrand)
  console.log(msgrand)
  var wb = false 
  if(message.content === "!item WB") {
    await txtlookup(shop_items[3].file, message.author.id).then(async (old) => {
      if (old >= 1) {
        var change = old - 1
        console.log(`Old: ${old}`)
        await replacefile(shop_items[3].file, `${message.author.id} - ${old}`, `${message.author.id} - ${change}`)
        wb = true
      } else {
        message.reply("You do not have a wave breaker to use!")
      }
    })
    if(msgrand >= 90) {
      message.reply("Your wave breaker failed!")
    }
  }

  if (((wb === true) && msgrand <= 90) || (msgrand >= 95)) {
    var bosschance = Math.random()
    bosschance =  bosschance * 100
    bosschance = Math.round(bosschance)
    console.log(bosschance)
    if (bosschance <= 50){
      var lesser_chance = 0
      spawnsalmon("lesser", message)
    } else {
      spawnsalmon("boss", message)
    }
  }
   
  if (message.content === "!leaderboard") {
    getusername(scores).then(responce => {
      message.channel.send({
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
  if (message.content === "!event leaderboard"){
    getusername(splatfest).then(responce => {
      message.channel.send({
        "channel_id": `${message.channel.id}`,
        "content": "",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `Splatfest Leaderboard!`,
            "description": responce,
            "color": 0x00FFFF
          }
        ]
      });
    });
  }
  if (message.content == "what is my score?"){
      fs.readFile(scores, function (err, data) {
        if (err) throw err;
        if(data.indexOf(message.author.id) < 0){
          fs.appendFileSync(scores, `\n${message.author.id} - 0`)
          message.reply("You have been added with a score of 0!")
        } else
        txtlookup(scores, message.author.id).then((score) => {
          message.reply(score)
        })
      })
  }
    if (message.content === "id plz") {
      message.reply(message.author.id)
    }

  if (message.content === "clear salmon") {
    message.reply("Cleared!")
    for (i in resetvars) {
      console.log(`${i}`)
      await txtlookup(main_txt, resetvars[i].name).then((old) => {
        console.log(`thing: ${resetvars[i].name} - ${old}`)
        replacefile(main_txt, `${resetvars[i].name} - ${old}`, `${resetvars[i].name} - ${resetvars[i].value}`)
      })
    } 
  }

  if (message.content === "ping") {
      message.reply('pong');
      
  } 


  if ((message.content).startsWith(`!splat`)) {
    var check = false
    await txtlookup(main_txt, "lesser").then(async (current) => {
      console.log(current)
      if (current === "none") {
        await txtlookup(main_txt, "boss").then(async (current2) => {
          if (current2 === "none") {
            await txtlookup(main_txt, "king").then(async (current3) => {
              if (current3 === "none") {
                message.reply("There is not an salmon to splat!")
              } else {
                salmon = king_salmon
                console.log(`Thing ${salmon}`)
                type = "king"
                check = true
              }
            })
          } else {
            console.log(current2)
          salmon = boss_salmon
          type = "boss"
          check = true
          }
        })
      } else {
        console.log("Lesser")
        salmon = lesser_salmon
        type = "lesser"
        check = true
      }
    })
    if (check){
      txtlookup(main_txt, type).then(async (current) => {
        var OHKO = false 
        var FS = false
        var DD = 1
        if ((message.content).includes(`item`)){
          for (i in shop_items){
            if((message.content).includes(shop_items[i].use)){ 
              await txtlookup(shop_items[i].file, message.author.id).then((amount) => {
                if (Number(amount) >= 1) {
                  replacefile(shop_items[i].file, `${message.author.id} - ${amount}`,`${message.author.id} - ${Number(amount) - 1}`)
                  console.log(i)
                  if (Number(i) === 0){
                    console.log("OHKO")
                    OHKO = true
                  }
                  if (Number(i) === 1){
                    FS = true
                    console.log("FS")
                  }
                  if (Number(i) === 2){
                    DD = 2
                    console.log("DD")
                  }
                  message.reply(`You used a ${shop_items[i].emoji} ${shop_items[i].name} ${FS}`)
                } else {
                  message.reply(`You have no ${shop_items[i].name} to use`)
                }
              })
            }
          }  
        }
        if ((message.content === `!splat ${salmon[current].name}`) || OHKO || FS){
          var rand = Math.random()
          var rand = rand*100
          var rand = Math.round(rand)
          if (rand <= salmon[current].hitbox || OHKO){
            txtlookup(main_txt, "health").then(async (health) => {
              health = Number(health) - 1
              if ((health === 0) || OHKO) {
                replacefile(main_txt, `${type} - ${current}`, `${type} - none`)
                replacefile(main_txt, `health - ${health + 1 *DD}`, `health - 0`)
                var userid = await message.author.id 
                console.log(userid)
                var userscore = await txtlookup(scores, userid)
                var usergoldeggs= await txtlookup(goldeneggs, userid)
                console.log(userscore)
                var goldeggammt = Math.random() * 6
                if(type === "boss"){
                  goldeggammt = Math.round(goldeggammt)
                  goldeggammt = goldeggammt - 3 + salmon[current].bonus
                  if (goldeggammt <= 0){
                    goldeggammt = 0
                  }
                } else
                  goldeggammt = 0
  
                var newscore = Number(userscore) + salmon[current].points + goldeggammt 
                var newgoldegg = Number(usergoldeggs) + goldeggammt 
                console.log(`${userid} - ${newscore}`)
                replacefile(scores, `${userid} - ${userscore}`, `${userid} - ${newscore}`)
                replacefile(goldeneggs, `${userid} - ${usergoldeggs}`, `${userid} - ${newgoldegg}`)
                
                if(type === "king"){
                  total_scales = Math.round(Math.random() * 20)
                  var count = 0
                  var gold = 0
                  var silver = 0
                  var bronze = 0
  
                  while (count < total_scales) {
                    var rand = Math.round(Math.random() * 100)
                    if(rand >= 90) {
                      gold++
                    }  else if(rand >= 75) {
                      silver++
                    } else {
                      bronze++
                    }
                    count++
                  }
                  var id_list = await idtoarray(king_ids);
                  console.log(`ID List: ${id_list}`)
                  mode(id_list).then(([id, num]) => {
                      var percent = ((num / id_list.length) * 100).toFixed(2)
                      message.channel.send(`🥇 - <@${id}> (${percent}% of damage)`)
                    scales.forEach(async function(scale, i) {
                      var value;
                      if (i === 0) {
                        value = bronze;
                      } else if (i === 1) {
                        value = silver;
                      } else {
                        value = gold;
                      }
                      var count = 0;
                      await addscales(count, value, scale, id_list).then(() => {
                        fs.readFile(king_ids, async function(err, data) {
                          replacefile(king_ids, data, "")
                        })
                      })
                      
                    }); 
                  })
                  
                }
                fs.readFile(scores, async function (err, data) {
                  if (err) throw err;
                  if(data.indexOf(message.author.id) < 0){
                    fs.appendFileSync(scores, `\n${message.author.id} - ${salmon[current].points}`)
                    message.reply(`You have been added with a score of ${salmon[current].points}!`)
                  } else
                  var boss_msg = ""
                  if(type === "boss") {
                    boss_msg = `\nYou found ${goldeggammt} golden eggs ${goldeggemoji} (+${goldeggammt * 2} points)`
                  } else if (type === "king") {
                    boss_msg = `\nYou got some scales! (Note: Scales are split between all players who attacked the king, the more you attack the more scales you can get) \n${scales[0].emoji} ${bronze}, ${scales[1].emoji} ${silver} ${scales[2].emoji} ${gold}`
                    var count = 0
                  }
                  message.reply(`You splatted a ${salmon[current].name} ${splatemoji}  ${salmon[current].emoji} ${boss_msg}\nYou now have ${Number(userscore)} points`)
                })
                fs.readFile(goldeneggs, async function (err, data) {
                  if (err) throw err;
                  if(data.indexOf(message.author.id) < 0){
                    fs.appendFileSync(goldeneggs, `\n${message.author.id} - ${goldeggammt}`)
                    message.reply(`You have been added with a a Golden Egg ammount of ${goldeggammt}!`)
                  }
                })
                  addstats(message.author.id).then(async () => {
                  var oldstats = await txtlookup(stats, message.author.id)
                  console.log(oldstats)
                  var splitstats = oldstats.split(' | ')
                  console.log(splitstats)
                  var newstats = splitstats
                  console.log(newstats)
                  var modify = Number(current)
                  console.log("Look below")
                  console.log(current)
                  if (type === "boss") {
                    modify = Number(current) + 3
                  }
                  if (type === "king"){
                    modify = Number(current) + 15
                  }
                  console.log(modify)
                  newstats[modify] = `${Number(splitstats[modify]) + 1}`
                  newstats.pop()
                  console.log(newstats)
                  var replacestats = ""
                  for(i in newstats){
                    console.log(newstats[i])
                    replacestats = `${replacestats}${newstats[i]} | ` 
                  }
                  replacefile(stats, `${message.author.id} - ${oldstats}`,  `${message.author.id} - ${replacestats}` )
  
                })
                
              } else
              message.reply(`You hit it! ${splatemoji} But it still has ${health}/${salmon[current].health} health left`)
              if(type === "king") {
                fs.appendFile(king_ids, `${message.author.id}\n`, function(err) {
                  if (err) throw err;
                });
              }
              replacefile(main_txt, `health - ${health + 1}`, `health - ${health}`)
            })
          } else
          message.reply(`You missed! Try again`)
  
        } else
        message.reply(`Incorrect salmon!`)
      })
    }

  }
  }
  
  if (message.content === "!shop") {
    var shopmessage = ""
    for (i in shop_items) {
      console.log(i)
      shopmessage = `${shopmessage}${Number(i) + 1}: ${shop_items[i].emoji} ${shop_items[i].name} X${shop_items[i].mult} (${shop_items[i].use}) | ${goldeggemoji} ${shop_items[i].cost}\n`
    }
    await txtlookup(goldeneggs, message.author.id).then((value) => {
      message.channel.send({
        "channel_id": `${message.channel.id}`,
        "content": "",
        "tts": false,
        "embeds": [
          {
            "type": "rich",
            "title": `${staff} Welcome to the shop!`,
            "description": `You currently have ${goldeggemoji} **${value}**`,
            "color": 0x00FFFF,
            "fields": [
              {
                "name": `Items:`,
                "value": `${shopmessage}`
              }
            ],
            "footer": {
              "text": `Do !buy [#] to purchase an item`
            }
          }
        ]
      });
    })
  }
  if ((message.content).startsWith("!desc")){
    for (i in shop_items){
      if(message.content === `!desc ${Number(i)+1}`){
        message.reply(shop_items[i].discription)
      }
    }
  } 
  if ((message.content).startsWith(`!buy`)) {
    var thing = false
    for(i in shop_items) {
      console.log(i)
      console.log(`Check this: ${Number(i) + 1}`)
      if (message.content === `!buy ${Number(i) + 1}`) {
        console.log(`Buying ${i}`)
        await txtlookup(goldeneggs, message.author.id).then(async (aviable) => {
            var price = shop_items[i].cost
          if (Number(aviable) >= shop_items[i].cost) {
            newgoldegg = aviable - shop_items[i].cost
            var item = shop_items[i]
            await replacefile(goldeneggs, `${message.author.id} - ${aviable}`, `${message.author.id} - ${newgoldegg}`).then(async () => {
              fs.readFile(shop_items[i].file, async function (err, data) {
                if (err) throw err;
                if(data.indexOf(message.author.id) < 0){
                  fs.appendFileSync(item.file, `\n${message.author.id} - ${1*item.mult}`)
                  message.reply(`You now have ${goldeggemoji} ${newgoldegg} and **${1*item.mult}** ${item.name} `)
                }else {
                  await txtlookup(item.file, message.author.id).then(async (old) => {
                    await replacefile(item.file, `${message.author.id} - ${old}`, `${message.author.id} - ${Number(old) + 1}`)
                    message.reply(`You now have ${goldeggemoji} **${newgoldegg}** and **${Number(old) + 1*item.mult}** ${item.name}`)
                  })  
                }
              })
            })
            
          } else {
            message.reply(`You do not have enough to buy this item, you have ${goldeggemoji} ${aviable}/${price}`)
          }
        })  
        thing = true
      } 
    }
    if (!thing) {
      message.reply(`Not a valid item, do \`!shop\` to see what you can buy`)
    }
  }
  if(message.content === "!inv"){
    var inv = ""
    for(i in shop_items){
      await txtlookup(shop_items[i].file, message.author.id).then((amount) => {
        if(amount === undefined){
          amount = 0
        }
        inv = `${inv}${shop_items[i].emoji} ${shop_items[i].name} | ${shop_items[i].use} | **${amount}**\n`
      })
    }
    var inv_scales = ""
    for(i in scales){
      await txtlookup(scales[i].file, message.author.id).then((amount) => {
        inv_scales = `${inv_scales}${scales[i].emoji} ${scales[i].name} | **${amount}**\n`
      })
    }
    var goldeggammt = 0
    await txtlookup(goldeneggs, message.author.id).then((amount) => {
      goldeggammt = amount
    })
    message.reply({
      "channel_id": `${message.channel.id}`,
      "content": "",
      "tts": false,
      "embeds": [
        {
          "type": "rich",
          "title": `Your Inventory`,
          "description": `This shows you your items and scales ammount`,
          "color": 0x00FFFF,
          "fields": [
            {
              "name": `Items:`,
              "value": `${inv}`
            },
            {
              "name": `Scales:`,
              "value": `${inv_scales}`
            },
            {
              "name": `Golden Eggs`,
              "value": `${goldeggemoji} ${goldeggammt}`
            }
          ],
          "footer": {
            "text": `Do !splat [salmon] item [CMD] to use an item`
          }
        }
      ]
    });
  }
  if(message.content === "!stats") {
    fs.readFile(stats, function (err, data) {
      if (err) throw err;
        addstats(message.author.id).then(() => {
        txtlookup(stats, message.author.id).then((userstats) => {
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
                type = king_salmon
              } else
                type = boss_salmon
            } else{
              type = lesser_salmon
            }
            statmessage = `${statmessage}${type[count].emoji}${type[count].name} | ${newstats[i]}\n`
            count = count + 1
          }
          message.channel.send({
            "channel_id": `${message.channel.id}`,
            "content": "",
            "tts": false,
            "embeds": [
              {
                "type": "rich",
                "title": `Here are your stats!`,
                "description": `${statmessage}`,
                "color": 0x00FFFF
              }
            ]
          })
        })
      })
    })
  }
});

client.login(config.discord.token);


