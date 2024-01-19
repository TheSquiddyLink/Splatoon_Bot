const splatoon3api = require("splatoon3api");
const Splatoon3 = new splatoon3api.Client("en-GB");

function all_data(mode){
    return new Promise(resolve => {
        if(mode === "salmon") {
            Splatoon3.getSalmonRun(res => {
                console.log(res)
                resolve(res.regularSchedules[0])
            })   
        } else {
            Splatoon3.getStages(res => {
                console.log(res)
                console.log(["open", "series"].includes(mode))
                if(["open", "series"].includes(mode)){
                    console.log(res.ranked[0][mode])
                    resolve(res.ranked[0][mode])
                } 
                
            });
        }

    })
}

function splatfest(){
    return new Promise(resolve => {
        Splatoon3.getCurrentSplatfest(res => {
            console.log(res)
            resolve(res)
        })
    })
}

module.exports = [ all_data, splatfest ]
