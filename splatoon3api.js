const splatoon3api = require("splatoon3api");
const Splatoon3 = new splatoon3api.Client("en-GB");

function all_data(mode, session = 0){
    if(session < 0) session = 0
    return new Promise(resolve => {
        if(mode === "salmon") {
            Splatoon3.getSalmonRun(res => {
                console.log(res)
                if(session > res.regularSchedules.length - 1) session = res.regularSchedules.length - 1
                resolve(res.regularSchedules[session])
            })   
        } else {
            Splatoon3.getStages(res => {
                console.log(res)
                console.log(["open", "series"].includes(mode))
                if(["open", "series"].includes(mode)){
                    if(session > res.ranked.length - 1) session = res.ranked.length - 1
                    console.log(res.ranked[session][mode])
                    resolve(res.ranked[session][mode])
                } else {
                    if(session > res.regular.length - 1) session = res.regular.length - 1
                    resolve(res.regular[session])
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
