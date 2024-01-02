const splatoon3api = require("splatoon3api");
const Splatoon3 = new splatoon3api.Client("en-GB");

function all_data(mode){
    return new Promise(resolve => {
        Splatoon3.getStages(res => {
            console.log(res)
            console.log(["open", "series"].includes(mode))
            if(["open", "series"].includes(mode)){
                console.log(res.ranked[0][mode])
                resolve(res.ranked[0][mode])
            } else {
                resolve(res[mode][0])
            }
            
        });
    })
}

module.exports = [ all_data ]
