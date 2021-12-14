import path from "path";

import fs from "fs";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJSON = (fileName) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));
};

const writeJSON = (fileName, json) => {
  fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(json));
};

const readCSV = (fileName) => {
  const data = fs.readFileSync(path.join(__dirname, fileName));
  const table = ToTable(data);
  // console.log(table);
  return table;
};
const readUCSV = (fileName) => {
  const data = fs.readFileSync(path.join(__dirname, fileName));
  const table = ToUTable(data);
  // console.log(table);
  return table;
};
const writeCSV = (fileName, data) => {
  fs.writeFileSync(path.join(__dirname, fileName), `\ufeff${fromTable(data)}`);
};

const fromTable = (data) => {
  let str = "";
  for (let r of data) {
    str += r.join(",") + "\r\n";
  }
  return str;
};

const ToTable = (data) => {
  data = data.toString();
  var table = new Array();
  var rows = new Array();
  rows = data.split("\r\n");
  for (var i = 0; i < rows.length; i++) {
    table.push(rows[i].split(",").map((r) => r.trim()));
  }

  return table;
};
const ToUTable = (data) => {
  data = data.toString();
  var table = new Array();
  var rows = new Array();
  rows = data.split("\n");
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].trim().length > 0) {
      table.push(rows[i].trim());
    }
  }

  return table;
};
const readCSVToJSON = (fileName) => {
  const data = fs.readFileSync(path.join(__dirname, fileName));
  const table = ConvertToTable(data);
  // console.log(table);
  return table;
};

const ConvertToTable = (data) => {
  data = data.toString();
  var table = {}; //new Array();
  var rows = {}; //new Array();
  rows = data.split("\r\n");
  let count = 0;
  let wrongaddresses = {};
  for (var i = 0; i < rows.length; i++) {
    let row = rows[i].split(",");
    const address = row[0].trim().toLowerCase();
    const addresslength = 42;
    if ("#N/A" != address && address.length == addresslength) {
      table[address] = row[1].trim();
    } else {
      wrongaddresses[row[2]] = row[1].trim();
      console.log(row, address.length);
      count++;
    }
  }
  console.log("==wrongaddresses===", wrongaddresses);

  return table;
};

const timeRange = (year) => {
  let nextyear = Number(year) + 1;
  let startdt = new Date(year + "-01-01 00:00:00.000");
  let enddt = new Date(nextyear + "-01-01 00:00:00.000");
  let startdatetime = (Date.parse(startdt)/1000 );
  let enddatetime = (Date.parse(enddt)/1000 );

  return { startdatetime, enddatetime };
};
const printHeaders = (req) => {
  console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
  console.log("x-forwarded-for = " + req.header("x-forwarded-for")); // 各阶段ip的CSV, 最左侧的是原始ip
  console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
  console.log("remoteAddress = " + req.connection.remoteAddress); // 未发生代理时，请求的ip
  console.log("socketremoteAddress = " + req.socket.remoteAddress); // 未发生代理时，请求的ip
  console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
  const referer = req.header("referer");
  console.log("=====referer=========", referer);
};

export {
  readJSON,
  writeJSON,
  readCSVToJSON,
  readUCSV,
  readCSV,
  writeCSV,
  timeRange,
  printHeaders,
};
