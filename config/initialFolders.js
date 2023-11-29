const path = require('path')
const fs = require("fs")

exports.initialFolders = async()=>{    
    try {
        let allDirectory = ["category","story","splashscreen","profile"]
        allDirectory.forEach((dirName)=>{
            if (fs.existsSync(`${__dirname}/../public/${dirName}`)) {
                console.log(`Directory exists=>${dirName}`)
            } else {
                console.log("Directory does not exist.")
                fs.mkdirSync(`${__dirname}/../public/${dirName}`);
            }
        })
    } catch(e) {
        console.log("An error occurred.")
    }
}

this.initialFolders()