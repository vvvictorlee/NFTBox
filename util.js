const path = require('path')

const fs = require('fs');

const getJSON = (fileName) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));
}

const putJSON = (fileName, json) => {
    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(json));
}

const readCSVToJSON = (fileName) => {
    const data = fs.readFileSync(path.join(__dirname, fileName));
    const table = ConvertToTable(data);
    // console.log(table);
    return table;
}

const ConvertToTable = (data) => {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\r\n");
    let count = 0;
    for (var i = 0; i < rows.length; i++) {
        const address = rows[i].split(",")[0].trim();
        const addresslength = 42;
        if ("#N/A" != address && address.length == addresslength) {
            table.push(rows[i].split(",").map(v=>v.trim()));
        }
        else {
            console.log(rows[i].split(","),address.length)
            count++;
        }
    }
    console.log("==count===", count)

    return table;
}

module.exports = { getJSON, putJSON, readCSVToJSON }