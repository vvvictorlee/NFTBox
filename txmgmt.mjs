import debug from "debug";
const apidebug = new debug("api:debug");
const apiinfo = new debug("api:info");
const apierror = new debug("api:error");
import Web3 from "web3";

const secrets_pairs = process.env.SECRETS || [];
const secrets = JSON.parse(secrets_pairs);
const _CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || [];
// const CONTRACT_ADDRESS = JSON.parse(_CONTRACT_ADDRESS);
const CONTRACT_ADDRESS = [
  "0xAad9654a4df6973A92C1fd3e95281F0B37960CCd",
  "0xA1588dC914e236bB5AE4208Ce3081246f7A00193",
  "0xD16bAbe52980554520F6Da505dF4d1b124c815a7",
  "0x92a0bD4584c147D1B0e8F9185dB0BDa10B05Ed7e",
  "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
];
const _TOTAL_SUPPLY = process.env.TOTAL_SUPPLY || 10000;
const TOTAL_SUPPLY = JSON.parse(_TOTAL_SUPPLY);

const _ABI_FILES = process.env.ABI_FILES || [];
let ABI_FILES = JSON.parse(_ABI_FILES);
import { readJSON } from "./util.mjs";

const address_balance_limit = process.env.ADDRESS_BALANCE_LIMIT || 1;
const address_transaction_count = process.env.ADDRESS_TRANSACTION_COUNT || 5;

const address_balance_limit_flag = process.env.ADDRESS_BALANCE_LIMIT_FLAG || 1;
const ip_flag = process.env.IP_FLAG || 1;

let contracts = [];
let contractobjs = {};

const PROVIDER_URL =
  process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const validators = secrets; //Object.keys(secrets);
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
let abi = {};
let contract = {};
let proxy = validators[0];
instanceContract();
// const index = 0;
// let indexOfProxy = 0;
export class TxMgmt {
  async balanceOf(address, index) {
    let amount = await contracts[index].methods
      .balanceOf(address)
      .call({ from: address });
    return amount;
  }
  async balance(address, contractAddress) {
    let amount = await contractobjs[contractAddress].methods
      .balanceOf(address)
      .call({ from: address });
    return amount;
  }
}

function instanceContract() {
  let json = readJSON("./jsons/ERC20Mintable.json");
  const abi = json.abi;

  for (let i = 0; i < CONTRACT_ADDRESS.length; i++) {
    contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS[i]);
    if (undefined == contract) {
      //console.log("un");
      return;
    }
    contracts.push(contract);
    contractobjs[CONTRACT_ADDRESS[i]] = contract;
  }
  // //console.log(Contract.methods)
}

let handlers = {
  default: async function () {},
};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

