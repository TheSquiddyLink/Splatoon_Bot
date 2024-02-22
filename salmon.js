const { data, functions, delay, mode } = require('./data.js')
const { EmbedBuilder } = require("discord.js")

const { sql, db } = require("./.database/sqlite.js")

var allSalmon = {}

class salmon {
  constructor(message){
    this.channelID = message.channelId
    this.serverID = message.guildId
    console.log("All Salmon:")
    console.log(allSalmon)
    if(allSalmon[this.serverID]) if(allSalmon[this.serverID][this.channelID]) this.FAIL = true;
    console.log("Salmon Status: ", this.FAIL)
      let bossChance = Math.round(Math.random() * 100)
      let globalData = functions.readData(data.json.global)
      let salmon_meter = globalData.salmon_meter
      this.salmonMeter = salmon_meter

      let salmonTypes
      if(salmon_meter === 100){
        this.type = "king"
        this.goldenEgg = 5
        this.kingIDs = []
        this.total_scales = Math.round(Math.random() * 20)

        salmonTypes = data.salmon.king_salmon
      } else if(bossChance <= 50){
        this.type = "lesser"
        salmonTypes = data.salmon.lesser_salmon
      } else {
        this.type = "boss"
        this.goldenEgg = Math.round(Math.random() * 3)
        salmonTypes = data.salmon.boss_salmon
      }
      const cumulativeWeights = [];
      let totalWeight = 0;
      for (const item of salmonTypes) {
        totalWeight += item.chance;
        cumulativeWeights.push(totalWeight);
      }
      const randomWeight = Math.random() * totalWeight
      this.salmonID = cumulativeWeights.findIndex((weight) => randomWeight < weight)
      this.salmonData = salmonTypes[this.salmonID]

      if(this.type === "boss") this.goldenEgg += salmonTypes[this.salmonID].bonus
      

      if(!allSalmon[this.serverID]) allSalmon[this.serverID] = {}
      allSalmon[this.serverID][this.channelID] = this 


    
  }
  addResponce(responce){
    this.responce = responce
  }
  spawnSalmon() {
    if(this.FAIL) return [ new EmbedBuilder().setDescription("There is already a salmon in this channel!") ]
    let globalData = functions.readData(data.json.global)
    
    let salmonMeter = parseFloat((globalData.salmon_meter + Math.random()*5).toFixed(2))
    if(this.type === "king"){
      salmonMeter = 0
    }
    if(salmonMeter > 100){
      salmonMeter = 100
    }

    globalData.salmon_meter = salmonMeter
    functions.writeData(data.json.global, globalData)

    delay(60000).then(() => {
      if(allSalmon[this.serverID]) if(allSalmon[this.serverID][this.channelID]) this.removeSalmon();
      else console.log("Salmon is already removed");
    })
    
    return this.spawnMessage()

  }
  spawnMessage() {
    let goldenEggMSG = ""
    if(this.type == "boss") goldenEggMSG = `Golden Eggs: ${data.emoji.goldeggemoji} ${this.goldenEgg}`
    let salmonMeterPhase = Math.round(this.salmonMeter/100 * (data.emoji.sm_states.length - 1)) 
    let embed = new EmbedBuilder()
    .setTitle(`A ${this.salmonData.name} has spawned!`)
    .setDescription(
      `Health: ${this.salmonData.health}
      Salmon Meter: ${data.emoji.sm_states[salmonMeterPhase]} ${this.salmonMeter}%
      ${goldenEggMSG}
      Power Eggs: ${data.emoji.powereggemoji} ${this.salmonData.points}\n
      Say \`/splat ${this.salmonData.name}\` to attack it`
    )
    .setColor(0xfa8124)
    .setImage(this.salmonData.image)

    return [ embed ]
  }

  async splat(damage, message) {
    let splatemoji = data.emoji.splatemoji
    if(this.type === "king"){
      this.kingIDs.push(message.user.id)
    }
    
    this.salmonData.health = this.salmonData.health - damage

    

    console.log(this.salmonData.health)
    if(this.salmonData.health <= 0){
      let userData = await this.updateStats(message)
      let userInv = await sql.GET('invintory', ['*'], 'id', message.user.id )
      console.log("User Inv:")
      console.log(userInv)
      let messages = []
      if(this.type === "king"){

        let arr = await mode(this.kingIDs)

        let percent = ((arr[1] / this.kingIDs.length) * 100).toFixed(2)
        let id = arr[0]
        messages.push(new EmbedBuilder().setDescription(`🥇 - <@${id}> (${percent}% of damage)`))
        messages.push(new EmbedBuilder().setDescription(`You now the following scales: \n ${data.scales[0].emoji} ${userInv.bronzeScale} ${data.scales[1].emoji} ${userInv.silverScale} ${data.scales[2].emoji} ${userInv.goldScale}`))

      }
      this.salmonData.health = 0
      messages.push(new EmbedBuilder().setDescription(`You splatted a ${this.salmonData.name} ${splatemoji}  ${this.salmonData.emoji}\nYou now have ${Number(userData.score)} points`))
      console.log(messages)
      this.responce.edit({embeds: [ new EmbedBuilder().setDescription("The salmon has been Splatted!") ]})
      return {msg: messages}
    } else {
      let splat = new EmbedBuilder().setDescription(`You hit it, and it has ${this.salmonData.health} health left!`)
      this.responce.edit({embeds: this.spawnMessage()})
      return {msg: [ splat ], hidden: true}
    }
  }

  async updateStats(message){
    console.log("Update Stats")
    let invintory = await functions.getTable("invintory", message.user.id)


    if(this.type === "king"){
      
      for(let i = 0; i < this.total_scales; i++){
        let rand = Math.round(Math.random() * 100)
        console.log(this.kingIDs)
        let randID = this.kingIDs[Math.round(Math.random() * (this.kingIDs.length - 1))]
        
        let randInv = await functions.getTable("invintory", randID)
        console.log("Rand Inv:")
        console.log(randInv)

        if(rand >= 90) randInv.goldScale++
        else if(rand >= 75) randInv.silverScale++
        else randInv.bronzeScale++
        sql.UPDATE('invintory', ['goldScale','silverScale', 'bronzeScale'], 'id', randID, [randInv.goldScale, randInv.silverScale, randInv.bronzeScale])
      }
    }
    invintory.powerEggs += this.salmonData.points
    let keys = ['powerEggs']
    let values = [invintory.powerEggs]

    if(this.type == 'boss'){
      invintory.goldenEggs += this.goldenEgg
      keys.push('goldenEggs')
      values.push(invintory.goldenEggs)
    }
    
    sql.UPDATE('invintory', keys, 'id', message.user.id, values)
    let userStat = await sql.GET('stats', [this.salmonData.stats_id], 'id', message.user.id)
    console.log(`User stat:`)
    console.log(userStat)
    if(userStat ===  null) sql.INSERT('stats', ['id', this.salmonData.stats_id], [message.user.id, 1])
    else {
      userStat = userStat[this.salmonData.stats_id]
      sql.UPDATE('stats', [this.salmonData.stats_id], 'id', message.user.id, [userStat + 1])
    }this.removeSalmon()
    return { score: invintory.powerEggs }
  }

  async removeSalmon() {
    await delay(200)
    console.log("Removed Salmon")
    delete allSalmon[this.serverID][this.channelID]
    if(Object.keys(allSalmon[this.serverID]).length === 0) delete allSalmon[this.serverID]
    console.log(allSalmon)
    delete this
  }
}

async function spawnSalmon(message){
  let test = new salmon(message)
  console.log(test)
  console.log(allSalmon)
  let responce = await message.reply({embeds: test.spawnSalmon()})
  test.addResponce(responce)
}

async function splatSalmon(message){
  let serverID = message.guildId
  let channelID = message.channelId
  let messageContent

  let hidden = false
  let salName = functions.getNthValue(message, 0)
  if(allSalmon[serverID]){
    if (allSalmon[serverID][channelID]) {
      console.log(allSalmon[serverID][channelID].salmonData.name)
      if(allSalmon[serverID][channelID].salmonData.name === salName){
        let splatData = await allSalmon[serverID][channelID].splat(1, message)
        if(splatData.hidden) hidden = true
        messageContent = splatData.msg
        console.log(allSalmon[serverID][channelID].salmonData.health)
      } else {
        messageContent = [ new EmbedBuilder().setDescription("Incorrect salmon!") ]
      }
    } else {
      console.log(allSalmon)
      let key = Object.keys(allSalmon[serverID])[0]
      console.log(allSalmon[serverID][key])
      messageContent = [ new EmbedBuilder().setDescription(`There is no salmon in this channel! Possible channel: <#${key}>`) ]
    }
  } else {
    messageContent = [ new EmbedBuilder().setDescription("There is no salmon in this server!") ]
  }

  console.log(messageContent)
  if(hidden) message.reply({embeds: messageContent, ephemeral: hidden})
  else message.reply({embeds: messageContent});
}

module.exports = { spawnSalmon, splatSalmon }
