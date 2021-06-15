const path = require('path')

const fs = require('fs');

const getJSON = (fileName) => {
        
    return JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));
}

const putJSON = (fileName, json) => {
    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(json));
}



const readCSV = (fileName) => {
    const data = fs.readFileSync(path.join(__dirname, fileName));
    const table = ToTable(data);
    // console.log(table);
    return table;
}

const writeCSV = (fileName, data) => {
    fs.writeFileSync(path.join(__dirname, fileName), `\ufeff${fromTable(data)}`);
}

const fromTable = (data) => {
    let str = "";
    for (let r of data){   
        str+= r.join(",")+"\r\n";
    }
    return str;
}

const ToTable = (data) => {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\r\n");
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(",").map(r => r.trim()))
    }

    return table;
}

const readCSVToJSON = (fileName) => {
    const data = fs.readFileSync(path.join(__dirname, fileName));
    const table = ConvertToTable(data);
    // console.log(table);
    return table;
}

const ConvertToTable = (data) => {
    data = data.toString();
    var table = {};//new Array();
    var rows = {};//new Array();
    rows = data.split("\r\n");
    let count = 0;
    let wrongaddresses = {};
    for (var i = 0; i < rows.length; i++) {
        let row = rows[i].split(",")
        const address = row[0].trim().toLowerCase();
        const addresslength = 42;
        if ("#N/A" != address && address.length == addresslength) {
            table[address] = row[1].trim();
        }
        else {
            wrongaddresses[row[2]] = row[1].trim();
            console.log(row, address.length)
            count++;
        }
    }
    console.log("==count===", count)
    console.log("==wrongaddresses===", wrongaddresses)

    return table;
}

module.exports = { getJSON, putJSON, readCSVToJSON,readCSV,writeCSV }