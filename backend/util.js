const path = require('path')

const fs = require('fs');

const getJSON = (fileName) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));
}

const putJSON=(fileName, json) =>{
    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(json));
}

module.exports={getJSON,putJSON}