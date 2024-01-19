const { ApplicationCommandOptionType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { data, functions } = require('./data.js')
const [ all_data, splatfest ] = require('./splatoon3api.js')
const { spawnRandom, splatSalmon } = require('./salmon.js');

const all_salmon = []
const types = ["lesser_salmon", "boss_salmon", "king_salmon"]
for(i in data.salmon){
  let type = data.salmon[i]
  for(j in type){
    all_salmon.push({name: type[j].name, value: type[j].name})
  }
}
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
  },
  {
    name: 'shop',
    description: 'Show all shop items',
    command: shop
  },
  {
    name: 'buy',
    description: 'buy an item from the shop',
    options: [
      {
        name: 'item',
        description: 'item you wish to buy',
        type: ApplicationCommandOptionType.String,
        choices: data.shop_items,
        required: true
      }
    ],
    command: buy
  },
  {
    name: 'desc',
    description: 'Get a description of an item',
    options: [
      {
        name: 'item',
        description: 'item you wish to buy',
        type: ApplicationCommandOptionType.String,
        choices: data.shop_items,
        required: true
      }
    ],
    command: desc
  },
  {
    name: "inv",
    description: "View your invintory",
    command: inv
  },
  {
    name: 'stats',
    description: 'view yours, or a differnt users stats',
    options: [
      {
        name: "user",
        description: "The users data you wish to see",
        value: "user",
        type: ApplicationCommandOptionType.User
      }
    ],
    command: stats
  },
  {
    name: "splat",
    description: "splat the current salmon",
    options: [
      {
        name: "salmon",
        value: "salmon",
        description: "The name of the salmon",
        type: ApplicationCommandOptionType.String,
        choices: all_salmon,
        required: true,
      },
      {
        name: "item",
        value: "item",
        description: "optional: Use an item",
        type: ApplicationCommandOptionType.String,
        choices: data.shop_items.filter(item => item.use_splat)
      }
    ],
    command: splat
  },
  {
    name: "item",
    value: "item",
    description: "Use the specified item",
    options: [
      {
        name: "item",
        value: "item_value",
        description: "Specified item to use",
        type: ApplicationCommandOptionType.String,
        choices: data.shop_items.filter(item => !item.use_splat)
      }
    ],
    command: item
  },
  {
    name: "rotation",
    description: "View the current rotation",
    options: [
      {
        name: "mode",
        value: "mode_value",
        description: "Specified Mode",
        type: ApplicationCommandOptionType.String,
        choices: data.modes,
        required: true
      }
    ],
    command: rotation
  },
  {
    name: "splatfest",
    description: "View the current splatfest",
    command: viewSplatfest,
  }

];

async function viewSplatfest(message){
  let rawData = await splatfest()
  rawData = rawData.US
  let startTime = toTimestamp(rawData.startTime)
  let endTime = toTimestamp(rawData.endTime)
  let title = rawData.title

  let teams = rawData.teams

  let main = new EmbedBuilder()
  .setTitle(title)
  .setDescription(`<t:${startTime}:f> - <t:${endTime}:f>`)

  let embeds = [main]
  for(let team in teams){
    
    
    let teamName = teams[team].teamName
    let image = teams[team].image
    let color = teams[team].colorHEX

    let teamEmbed = new EmbedBuilder()
    .setTitle(teamName)
    .setImage(image)
    .setColor(color.substring(0, 7))

    embeds.push(teamEmbed)
  }
  message.reply({embeds: embeds})
}


async function rotation(message){
 
  let mode = functions.getNthValue(message, 0)
  console.log(mode)

  let rotMessage = await rotationMessage(mode)

  let response = await message.reply(rotMessage)
  
  waitRotMenu(response, message)
}

async function editRotation(mode, response, message){
  console.log(mode)
  let rotMessage = await rotationMessage(mode)
  response.edit(rotMessage)
  waitRotMenu(response, message)
}

async function waitRotMenu(response, message){
  const collectorFilter = i => i.user.id === message.user.id;

  try{
    const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    if(confirmation.customId === "mode"){
      await confirmation.deferUpdate();
      console.log("Button Worked!")
      console.log(confirmation.values)
      editRotation(confirmation.values[0], response, message)
    }
  } catch (e) {
    console.log("Timed out")
    response.edit({content: response.content, components: []})
  }
}

async function rotationMessage(mode){
  let modeData = data.modeValue 

  let rotationData = await all_data(mode)
  console.log(rotationData)

  let startTime = functions.toTimestamp(rotationData.start_time)

  let endTime = functions.toTimestamp(rotationData.end_time)
  console.log(modeData[mode].image)

  let rules
  let rulesImage

  let rulesEmbed = false
  if(["open", "series"].includes(mode)){
    rules = rotationData.rules
    rulesImage = data.rules[rules]
    rulesEmbed = true
  }

  console.log(rotationData.rulesImg)

 
  
  let info = new EmbedBuilder()
  .setTitle(`Rotation for ${modeData[mode].name}`)
  .setDescription(`<t:${startTime}:t> - <t:${endTime}:t>`)
  .setThumbnail(modeData[mode].image)

  if(rulesEmbed){
    rulesEmbed = new EmbedBuilder()
    .setTitle("Rules")
    .setDescription(rules)
    .setThumbnail(rulesImage)
  }
  

  let stage_1 = new EmbedBuilder()
  .addFields(
    {name: "Stage 1", value: rotationData.stage1.name},
  )
  .setImage(rotationData.stage1.image)

  let stage_2 = new EmbedBuilder()
  .addFields(
    {name: "Stage 2", value: rotationData.stage2.name},
  )
  .setImage(rotationData.stage2.image)  
  let options = []
  
  for(el of data.modes){
    let option = new StringSelectMenuOptionBuilder()
      .setLabel(el.name)
      .setValue(el.value)
    options.push(option)
  }
  let menu = new StringSelectMenuBuilder()
  .addOptions(options)
  .setCustomId("mode")
  .setPlaceholder(modeData[mode].name)

  let row = new ActionRowBuilder()
  .addComponents(menu)

  let embeds = [info, stage_1, stage_2]
  if(rulesEmbed) embeds.splice(1, 0, rulesEmbed)

  return {embeds: embeds, components: [row]}

} 

function item(message){
  let userData = functions.readData(data.json.user)
  let items = data.shop_items.filter(item => !item.use_splat)
  for(i in items){
    if(items[i].value === functions.getNthValue(message, 0)){
        items[i].command
        console.log(items[i].value)
        if(items[i].value === "WB"){
          console.log(userData.shop_items.WB[message.user.id])
          if(userData.shop_items.WB[message.user.id] >= 1){
            spawnRandom(message)
            userData.shop_items.WB[message.user.id] = userData.shop_items.WB[message.user.id] - 1
            functions.writeData(data.json.user, userData)
          } else {
            message.reply("You don't have enough Wave Breakers")
          }
        }
    }
  }

}

function splat(message){
  splatSalmon(message)
}
function stats(message){
  let value = functions.getNthValue(message, 0)
  functions.statsResponce(message, value)

}

async function inv(message){
  let inv = ""
  let all_items = data.shop_items
  let userData = await functions.readData(data.json.user)

  for(i in all_items){
    let ammount = userData.shop_items[all_items[i].value][message.user.id]
    if(ammount === undefined){
      ammount = 0
    }
    inv = `${inv}${all_items[i].emoji} ${all_items[i].name} | ${all_items[i].value} | **${ammount}**\n`
  }

  let goldeggammt = userData.goldeneggs[message.user.id]
  
  let inv_scales = ""
  for(i in data.scales){
    let ammount = userData.scales[data.scales[i].name][message.user.id]
    inv_scales = `${inv_scales}${data.scales[i].emoji} ${data.scales[i].name} | **${ammount}**\n`
  }

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
              "value": `${data.emoji.goldeggemoji} ${goldeggammt}`
            }
          ],
          "footer": {
            "text": `Do !splat [salmon] item [CMD] to use an item`
          }
        }
      ]
    });
}
function desc(message){
  let value = functions.getNthValue(message, 0)
  for(i in data.shop_items){
    if(value === data.shop_items[i].value){
      message.reply(`### ${data.shop_items[i].name} \n${data.shop_items[i].description}`)
    }
  }
}

async function buy(message){
  let value = functions.getNthValue(message, 0)
  let id = message.user.id
  let shop_items = data.shop_items
  let userData = functions.readData(data.json.user)

  let goldeggemoji = data.emoji.goldeggemoji
  for(i in shop_items){
    if(shop_items[i].value === value){
      let aviable = userData.goldeneggs[id]
      let item = shop_items[i]
        var price = item.cost
      if (Number(aviable) >= price) {
        newgoldegg = aviable - price
        console.log(item)
        functions.buyResponce(id, newgoldegg, item, message)
        
      } else {
        message.reply(`You do not have enough to buy this item, you have ${goldeggemoji} ${aviable}/${price}`)
      }
    }
  }

}

async function shop(message){
  let shopmessage = ""
  let shop_items = data.shop_items
  for (i in shop_items) {
    console.log(i)
    shopmessage = `${shopmessage}${Number(i) + 1}: ${shop_items[i].emoji} ${shop_items[i].name} X${shop_items[i].mult} (${shop_items[i].value}) | ${data.emoji.goldeggemoji} ${shop_items[i].cost}\n`
  }
  
  let value = await functions.readData(data.json.user).goldeneggs[message.user.id]
    message.reply({
      "channel_id": `${message.channel.id}`,
      "content": "",
      "tts": false,
      "embeds": [
        {
          "type": "rich",
          "title": `${data.emoji.staff} Welcome to the shop!`,
          "description": `You currently have ${data.emoji.goldeggemoji} **${value}**`,
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
}

function leaderboard(message){
  let type = message.options._hoistedOptions[0].value
  let file
  if(type === "event"){
    file = "event"
  } else {
    file = "scores"
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
  message.reply("Pong!")
}

function dynamicCommand(typeOption){
  let type = data.salmon[typeOption]
  commands.options.find(opt => opt.name === 'salmon').choices = salmonChoices;

}
async function event(message){
  let globalData = await functions.readData(data.json.global)
  let start = globalData.event.event_start
  let end = globalData.event.event_end
  let now = Math.floor(new Date().getTime() / 1000)
  let event = globalData.event.event_name
  let disc = globalData.event.event_disc

  if (event === ""){
    message.reply("There are no upcoming events")
  } else {
    if(start < now){
      if(end > now){ 
        message.reply(`There is an active ${event}! it ends in <t:${end}:R> on <t:${end}:f> \n Event Discription: \n ${disc}`)
      } else {
        message.reply(`The ${event} has ended!`)
      }
    } else {
      message.reply(`Next ${event} starts in <t:${start}:R> on <t:${start}:f>`)
    }
  }
}
module.exports = [ commands, dynamicCommand ];