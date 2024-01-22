const { data, functions, delay, optional } = require('./data.js')
const { EmbedBuilder } = require("discord.js")

function spawnRandom(message){
  var bosschance = Math.random()
    bosschance =  bosschance * 100
    bosschance = Math.round(bosschance)
    console.log(bosschance)
    if (bosschance <= 50){
      spawnsalmon("lesser", message)
    } else {
      spawnsalmon("boss", message)
    }
}
async function spawnsalmon(type, message){
    let salmon = data.salmon
    let globalData = await functions.readData(data.json.global)

    let salmon_meter = globalData.salmon_meter
      kingrand = Math.round(Math.random() * 200)
      console.log(salmon_meter)
      if(salmon_meter === "100"){
        var gldegg = 5 
        console.log("Spawning King")
          for(i in salmon.king_salmon) {
            if (kingrand >= salmon.king_salmon[i].chance) {
              let embed = new EmbedBuilder()
              .setTitle(`A ${salmon.king_salmon[i].name} spawned!`)
              .setDescription(`Health: ${salmon.king_salmon[i].health}\nGolden Eggs: ${data.emoji.goldeggemoji} ${gldegg}\nPower Eggs: ${data.emoji.powereggemoji} ${salmon.king_salmon[i].points}\n\nSay \`!splat ${salmon.king_salmon[i].name}\` to attack it`)
              .setColor(0xfa8124)
              .setImage(salmon.king_salmon[i].image)

              message.reply({embeds: [embed]})
              
              globalData.salmon.king = i
              globalData.health = salmon.king_salmon[i].health
              globalData.salmon_meter = 0
              functions.writeData(data.json.global, globalData)
              break
            }
          } 
      } else {

        let lesser = globalData.salmon.lesser
        let boss = globalData.salmon.boss
        let king = globalData.salmon.king

        let cooldown = globalData.cooldown
        if(lesser === "none"){
          if(boss === "none"){
            if(king === "none"){
              if(cooldown === false){
                var rand = Math.random()
                var rand = rand*100
                var rand = Math.round(rand)
                console.log(rand)
                console.log(`This is the salmon meter: ${salmon_meter}`)
                if(salmon_meter >= 100){
                  console.log("Spawning King")
                  salmon = salmon.king_salmon
                  globalData.salmon_meter = 0
                  gldegg = "0"
                } else if (type === "boss"){
                  salmon = salmon.boss_salmon
                  gldegg = "0-3"
                } else if (type === "lesser") {
                  salmon = salmon.lesser_salmon
                  gldegg = "0"
                }
                
                
                for (i in salmon){
                  console.log(salmon[i].chance)
                  if (rand >= salmon[i].chance){

                    let RO = globalData.reaction_only
                      console.log(`Value: ${RO}`)
                      if (RO === "true") {
                        console.log("Reacting...")
                        message.react(salmon[i].emoji)
                        if (type === "boss"){
                          message.react(data.emoji.goldeggemoji)
                        }
                      
                      } else {
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
                          console.log(`Salmon Meter: ${salmon_meter2}`)
                          if (salmon_meter2 >= 100){
                            salmon_meter2 = 100
                          }
                          if(salmon_meter >= 100){
                            salmon_meter2 = 0
                          }
                          
                          globalData.salmon_meter = salmon_meter2

                          let embed = new EmbedBuilder()
                          .setTitle(`A ${salmon[i].name} spawned!`)
                          .setDescription(`Health: ${salmon[i].health}\nGolden Eggs: ${data.emoji.goldeggemoji} ${gldegg}\nPower Eggs: ${data.emoji.powereggemoji} ${salmon[i].points}\n\nSay \`!splat ${salmon[i].name}\` to attack it`)
                          .setColor(0xfa8124)
                          .setImage(salmon[i].image)
                          .setFields({
                            name: "Salmon Meter",
                            value: `${data.sm_states[salmon_state]}${salmon_meter2}%`,
                          })

                          message.reply({embeds: [embed]})
                      }
                      globalData.salmon[type] = i
                      globalData.health = salmon[i].health
                      globalData.cooldown = true
                    console.log("Timer Started")
                    functions.writeData(data.json.global, globalData)
                    await delay(60000)
                    console.log("Timer Ended")
                    let new_global = await functions.readData(data.json.global)
                    console.log(new_global.salmon[type])
                    let current = new_global.salmon[type]
                    new_global.cooldown = false
                    if(!(current === "none")){
                      message.channel.send(`The ${salmon[current].name} got away :(` )
                      
                      new_global.salmon.lesser = "none"
                      new_global.salmon.boss = "none"
                      new_global.health = 0
                      new_global.cooldown = false
                      functions.writeData(data.json.global, new_global)
                    }
                    break
                  }
                }
              } else {
                message.reply("Unable to spawn salmon, on cooldown")
              }
            } else {
              message.reply("There is already a king salmon")
            }
          } else {
            message.reply("There is already a boss salmon")
          }
        } else {
          message.reply("There is already a lesser salmon")
        }
      }
    }

  async function splatSalmon(message){
    var check = false
    let salmon
    let lesser_salmon = data.salmon.lesser_salmon
    let boss_salmon = data.salmon.boss_salmon
    let king_salmon = data.salmon.king_salmon
    let splatemoji = data.emoji.splatemoji

    let userData = await functions.readData(data.json.user)
    let globalData = await functions.readData(data.json.global)

    let lesser = globalData.salmon.lesser
    let boss = globalData.salmon.boss
    let king = globalData.salmon.king

    if(lesser === "none"){
      if(boss === "none"){
        if(king === "none"){
          message.reply("There is not an salmon to splat!")
        } else {
          salmon = king_salmon
          console.log(`Thing ${salmon}`)
          type = "king"
          check = true
        }
      } else {
        salmon = boss_salmon
        type = "boss"
        check = true
      }
    }  else {
      console.log("Lesser")
      salmon = lesser_salmon
      type = "lesser"
      check = true
    }
    if (check){
        var dmg_mult = 1
        if(functions.getNthValue(message, 1)){
          let item = functions.getNthValue(message, 1)
          console.log("Using item")
          let shop_items = data.shop_items.filter(item => item.use_splat) 
          for(i in shop_items){
            if(shop_items[i].value === item){
              console.log(`Check this: ${shop_items[i].file}`)
              let shop_item = shop_items[i]
                let current4 = userData.shop_items[message.user.id] 
                if(current4 > 0 ){
                  console.log(shop_item)
                  dmg_mult = shop_item.damge
                  console.log(item)
                  userData.shop_items[message.user.id] = current4 - 1

                  functions.writeData(data.json.user, userData)
                } else {
                  message.reply("You do not have any of that item")
                }
            }
          }
        }
        console.log(`Look here: ${functions.getNthValue(message, 0)}`)
        let current = globalData.salmon[type]
        console.log(salmon[current].name)
        if (functions.getNthValue(message, 0) === salmon[current].name){
          var rand = Math.random()
          var rand = rand*100
          var rand = Math.round(rand)
          if (rand <= salmon[current].hitbox){
              health = globalData.health
              health = Number(health) - 1 * dmg_mult
              if(health < 0) health = 0
              if ((health === 0)) {
                globalData.salmon[type] = "none"
                globalData.health = 0
                var userid = await message.user.id 
                console.log(userid)
                var userscore = userData.scores[userid]
                var usergoldeggs = userData.goldeneggs[userid]
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
                userData.goldeneggs[userid] = newgoldegg
                
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
                  var id_list = await functions.readData(data.json.global)
                  id_list = id_list.king_ids
                  console.log(`ID List: ${id_list}`)
                  optional.mode(id_list).then(([id, num]) => {
                      var percent = ((num / id_list.length) * 100).toFixed(2)
                      message.reply(`🥇 - <@${id}> (${percent}% of damage)`)
                    data.scales.forEach(async function(scale, i) {
                      var value;
                      if (i === 0) {
                        value = Bronze;
                      } else if (i === 1) {
                        value = Silver;
                      } else {
                        value = Gold;
                      }

                        let rawData = optional.addscales(value, scale, id_list)
                        rawData.king_ids = []
                        functions.writeData(data.json.global, rawData)
                      
                    }); 
                  })
                  
                }
                let rawData = await functions.readData(data.json.user)
                let all_scores = rawData.scores

                console.log("Points" + salmon[current].points)
                console.log(all_scores[message.user.id])
                if(all_scores[message.user.id] === undefined){
                  all_scores[message.user.id] = salmon[current].points
                  message.reply(`You have been added with a score of ${salmon[current].points}!`)
                } else {
                  all_scores[message.user.id] = all_scores[message.user.id] + salmon[current].points
                }
                rawData.scores = all_scores

                functions.writeData(data.json.user, rawData)
                var boss_msg = ""
                if(type === "boss") {
                  boss_msg = `\nYou found ${goldeggammt} golden eggs ${data.emoji.goldeggemoji} (+${goldeggammt * 2} points)`
                } else if (type === "king") {
                  boss_msg = `\nYou got some scales! (Note: Scales are split between all players who attacked the king, the more you attack the more scales you can get) \n${scales[0].emoji} ${bronze}, ${scales[1].emoji} ${silver} ${scales[2].emoji} ${gold}`
                  var count = 0
                }
                
                message.reply(`You splatted a ${salmon[current].name} ${splatemoji}  ${salmon[current].emoji} ${boss_msg}\nYou now have ${Number(userscore)} points`)
                
                if(userData.goldeneggs[userid] === undefined){
                  userData.goldeneggs[userid] = goldeggammt
                  message.reply(`You have been added with a a Golden Egg ammount of ${goldeggammt}!`)
                }
                optional.addStats(message.user.id).then(async () => {
                  var oldstats = userData.stats.users[userid]
                  if (type === "boss") {
                    modify = Number(current) + 3
                  } else if (type === "king"){
                    modify = Number(current) + 15
                  } else {
                    modify = Number(current)
                  }




                  oldstats[modify] = oldstats[modify] + 1

                  userData.stats.users[userid] = oldstats

                  functions.writeData(data.json.user, userData)
                })
                
              } else
              message.reply(`You hit it! ${splatemoji} But it still has ${health}/${salmon[current].health} health left`)
              if(type === "king") {
                rawData = await functions.readData(data.json.global)
                rawData.king_ids.push(message.user.id)
                functions.writeData(data.json.global, rawData)
              }
              globalData.health = health
              functions.writeData(data.json.global, globalData)
          } else
          message.reply(`You missed! Try again`)
  
        } else
        message.reply(`Incorrect salmon!`)
    }

  }

  module.exports = { spawnsalmon, spawnRandom, splatSalmon }