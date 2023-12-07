const { data, functions, delay, optional } = require('./data.js')
const fs = require('fs');
const readline = require('node:readline');
const replaceInFile = require('replace-in-file/lib/replace-in-file');

function spawnRandom(message){
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
async function spawnsalmon(type, message){
    let main_txt = data.files.main_txt
    let salmon = data.salmon
    functions.txtlookup(main_txt, 'salmon_meter').then((salmon_meter) => {
      kingrand = Math.round(Math.random() * 200)
      console.log(salmon_meter)
      if(salmon_meter === "100"){
        var gldegg = 5 
        console.log("Spawning King")
          for(i in salmon.king_salmon) {
            if (kingrand >= salmon.king_salmon[i].chance) {
              message.reply({
                            
                "channel_id": `${message.channel.id}`,
                "content": "",
                "tts": false,
                "embeds": [
                  {
                    "type": "rich",
                    "title": `A ${salmon.king_salmon[i].name} spawned!`,
                    "description": `Health: ${salmon.king_salmon[i].health}\nGolden Eggs: ${data.emoji.goldeggemoji} ${gldegg}\nPower Eggs: ${data.emoji.powereggemoji} ${salmon.king_salmon[i].points}\n\nSay \`!splat ${salmon.king_salmon[i].name}\` to attack it`,
                    "color": 0xfa8124,
                    "image": {
                      "url": `${salmon.king_salmon[i].image}`,
                      "height": 0,
                      "width": 0
                    },
                  }
                ]
              })
              functions.replacefile(main_txt, "king - none", `king - ${i}`)
              functions.replacefile(main_txt, "health - 0", `health - ${salmon.king_salmon[i].health}`)
              functions.replacefile(main_txt, "salmon_meter - 100", `salmon_meter - 0`)
              break
            }
          } 
      } else {
        functions.txtlookup(main_txt, "lesser").then(async (current) => {
          console.log(current)
          if (current === "none") {
            functions.txtlookup(main_txt, "boss").then(async (current) => {
              console.log(current)
              if (current === "none") {
                functions.txtlookup(main_txt, "king").then(async (current) => {
                  if (current === "none") {
                    functions.txtlookup(main_txt, "cooldown").then(async (cooldown) => {
                      if(cooldown === "false"){
                        var rand = Math.random()
                        var rand = rand*100
                        var rand = Math.round(rand)
                        console.log(rand)
                        if (type === "boss"){
                          salmon = salmon.boss_salmon
                          gldegg = "0-3"
                        } 
                        if (type === "lesser") {
                          salmon = salmon.lesser_salmon
                          gldegg = "0"
                        }
                        
                        for (i in salmon){
                          console.log(salmon[i].chance)
                          if (rand >= salmon[i].chance){
                            await functions.txtlookup(main_txt, "reaction_only").then((value) => {
                              console.log(`Value: ${value}`)
                              if (value === "true") {
                                console.log("Reacting...")
                                message.react(salmon[i].emoji)
                                if (type === "boss"){
                                  message.react(data.emoji.goldeggemoji)
                                }
                              
                              } else {
                                functions.txtlookup(main_txt, "salmon_meter").then(async (salmon_meter) => {
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
                                    await functions.replacefile(main_txt, `salmon_meter - ${salmon_meter}`, `salmon_meter - 100`)
                                  } else {
                                    await functions.replacefile(main_txt, `salmon_meter - ${salmon_meter}`, `salmon_meter - ${salmon_meter2}`)
                                  }
                                  message.reply({
                                    
                                    "channel_id": `${message.channel.id}`,
                                    "content": "",
                                    "tts": false,
                                    "embeds": [
                                      {
                                        "type": "rich",
                                        "title": `A ${salmon[i].name} spawned!`,
                                        "description": `Health: ${salmon[i].health}\nGolden Eggs: ${data.emoji.goldeggemoji} ${gldegg}\nPower Eggs: ${data.emoji.powereggemoji} ${salmon[i].points}\n\nSay \`!splat ${salmon[i].name}\` to attack it`,
                                        "color": 0xfa8124,
                                        "image": {
                                          "url": `${salmon[i].image}`,
                                          "height": 0,
                                          "width": 0
                                        },
                                        "fields": [
                                          {
                                            "name": `Salmon Meter:`,
                                            "value": `${data.sm_states[salmon_state]}${salmon_meter2}%`
                                          }
                                        ],
                                      }
                                    ]
                                  })
                                })
              
                              }
                              functions.replacefile(main_txt, `${type} - none`, `${type} - ${i}`)
                              functions.replacefile(main_txt, `health - 0`, `health - ${salmon[i].health}`)
              
                            })
                            console.log("Timer Started")
                            functions.replacefile(main_txt, "cooldown - false", "cooldown - true")
                            await delay(60000)
                            console.log("Timer Ended")
                            functions.replacefile(main_txt, "cooldown - true", "cooldown - false")
                            functions.txtlookup(main_txt, "lesser").then((value) => {
                                functions.txtlookup(main_txt, "boss").then((value2) => {
                                  if ((!(value === "none")) || (!(value2 === "none"))) {
                                    message.channel.send(`The ${salmon[i].name} got away :(` )
                                    functions.replacefile(main_txt, `lesser - ${i}`, `lesser - none`)
                                    functions.replacefile(main_txt, `boss - ${i}`, `boss - none`)
                                    functions.txtlookup(main_txt, "health").then((health) => {
                                      functions.replacefile(main_txt, `health - ${health}`, `health - 0`)
                                    })
                                  }
                                })
                            })
                            break
                          }
                        }
                      } else {
                        message.reply("Unable to spawn salmon, on cooldown")
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

  async function splatSalmon(message){
    let main_txt = data.files.main_txt
    var check = false
    let salmon
    let lesser_salmon = data.salmon.lesser_salmon
    let boss_salmon = data.salmon.boss_salmon
    let king_salmon = data.salmon.king_salmon
    let stats = data.files.stats
    let scores = data.files.scores
    let goldeneggs = data.files.goldeneggs
    let splatemoji = data.emoji.splatemoji
    await functions.txtlookup(main_txt, "lesser").then(async (current) => {
      console.log("AAA")
      console.log(current)

      if (current === "none") {
        await functions.txtlookup(main_txt, "boss").then(async (current2) => {
          if (current2 === "none") {
            await functions.txtlookup(main_txt, "king").then(async (current3) => {
              
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
      functions.txtlookup(main_txt, type).then(async (current) => {
        var dmg_mult = 1
        if(functions.getNthValue(message, 1)){
          let item = functions.getNthValue(message, 1)
          console.log("Using item")
          let shop_items = data.shop_items.filter(item => item.use_splat) 
          for(i in shop_items){
            if(shop_items[i].value === item){
              console.log(`Check this: ${shop_items[i].file}`)
              let shop_item = shop_items[i]
              functions.txtlookup(shop_item.file, message.user.id).then( async (current4) => {
                if(current4 > 0 ){
                  console.log(shop_item)
                  dmg_mult = shop_item.damge
                  console.log(item)
                  functions.replacefile(shop_item.file, `${message.user.id} - ${current4}`, `${message.user.id} - ${current4 - 1}`)
                } else {
                  message.reply("You do not have any of that item")
                }
   
              })
            }
          }
        }
        console.log(`Look here: ${functions.getNthValue(message, 0)}`)
        console.log(salmon[current].name)
        if (functions.getNthValue(message, 0) === salmon[current].name){
          var rand = Math.random()
          var rand = rand*100
          var rand = Math.round(rand)
          if (rand <= salmon[current].hitbox){
            functions.txtlookup(main_txt, "health").then(async (health) => {
              health = Number(health) - 1 * dmg_mult
              if(health < 0) health = 0
              if ((health === 0)) {
                functions.replacefile(main_txt, `${type} - ${current}`, `${type} - none`)
                functions.replacefile(main_txt, `health - ${health + 1 * dmg_mult}`, `health - 0`)
                var userid = await message.user.id 
                console.log(userid)
                var userscore = await functions.txtlookup(scores, userid)
                var usergoldeggs= await functions.txtlookup(goldeneggs, userid)
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
                functions.replacefile(scores, `${userid} - ${userscore}`, `${userid} - ${newscore}`)
                functions.replacefile(goldeneggs, `${userid} - ${usergoldeggs}`, `${userid} - ${newgoldegg}`)
                
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
                  var id_list = await data.readData(data.json.global)
                  id_list = id_list.king_ids
                  console.log(`ID List: ${id_list}`)
                  mode(id_list).then(([id, num]) => {
                      var percent = ((num / id_list.length) * 100).toFixed(2)
                      message.reply(`🥇 - <@${id}> (${percent}% of damage)`)
                    scales.forEach(async function(scale, i) {
                      var value;
                      if (i === 0) {
                        value = bronze;
                      } else if (i === 1) {
                        value = silver;
                      } else {
                        value = gold;
                      }
                        await optional.addscales(value, scale, id_list).then(() => {
                          fs.readFile(king_ids, async function(err, data) {
                            functions.replacefile(king_ids, data, "")
                          })
                        })
                      
                    }); 
                  })
                  
                }
                fs.readFile(scores, async function (err, data) {
                  if (err) throw err;
                  if(data.indexOf(message.user.id) < 0){
                    fs.appendFileSync(scores, `\n${message.user.id} - ${salmon[current].points}`)
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
                  if(data.indexOf(message.user.id) < 0){
                    fs.appendFileSync(goldeneggs, `\n${message.user.id} - ${goldeggammt}`)
                    message.reply(`You have been added with a a Golden Egg ammount of ${goldeggammt}!`)
                  }
                })
                  optional.addStats(message.user.id).then(async () => {
                  var oldstats = await functions.txtlookup(stats, message.user.id)
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
                  functions.replacefile(stats, `${message.user.id} - ${oldstats}`,  `${message.user.id} - ${replacestats}` )
  
                })
                
              } else
              message.reply(`You hit it! ${splatemoji} But it still has ${health}/${salmon[current].health} health left`)
              if(type === "king") {
                rawData = await functions.readData(data.json.global)
                rawData.king_ids.push(message.user.id)
                functions.writeData(data.json.global, rawData)
              }
              functions.replacefile(main_txt, `health - ${health + 1}`, `health - ${health}`)
            })
          } else
          message.reply(`You missed! Try again`)
  
        } else
        message.reply(`Incorrect salmon!`)
      })
    }

  }

  module.exports = { spawnsalmon, spawnRandom, splatSalmon }