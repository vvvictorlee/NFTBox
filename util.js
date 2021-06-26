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
    for (let r of data) {
        str += r.join(",") + "\r\n";
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
    const table = ConvertToTable(data,fileName.replace(".csv","wrong.json"));
    // console.log(table);
    return table;
}

const ConvertToTable = (data,f) => {
    data = data.toString();
    var table = {};//new Array();
    var rows = {};//new Array();
    rows = data.split("\r\n");
    let count = 0;
    let wrongaddresses = [];
    let address = "";
    for (var i = 0; i < rows.length; i++) {
        if (rows[i]==undefined || rows[i].length==0){
            console.log("skip wrong row:=======",rows[i])

            continue;
        }
        let row = rows[i].split(",")
        address = row[2]
        if (address != undefined) {
            address = address.trim();
        }
        else {
            console.log("skip wrong row to continue:=======",rows[i], row)
            continue;
        }
        const addresslength = 42;
        if (address != undefined && "#N/A" != address && address.length == addresslength) {
            table[address] = row[4].trim();
        }
        else {
            wrongaddresses.push(rows[i]);
            count++;
        }
    }
    console.log("==count===", count)
    console.log("==wrongaddresses===", wrongaddresses)
    console.log(  '0x861dFA9BD952fA6670DFC3cA9e53B9aa4fWB13C'.trim().length)
    putJSON(f,wrongaddresses)
    return table;
}

module.exports = { getJSON, putJSON, readCSVToJSON, readCSV, writeCSV }