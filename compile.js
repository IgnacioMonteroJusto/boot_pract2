const path = require("path");
const fs = require("fs");
const solc = require("solc");
const async = require("async");

//con esta variable nos posicionamos desde la raiz del proyecto hasta inbox.sol
const campaignPath = path.resolve(__dirname, "contracts", "campaign.sol");//aqui tendrían que venir los dos contratos
//const proxyPath = path.resolve(__dirname, "contracts", "proxy.sol");
const source = fs.readFileSync(campaignPath, "utf-8");

console.log("Source = ", source);

const proxyPath = path.resolve(__dirname, "contracts", "proxy.sol");
const proxySource = fs.readFileSync(proxyPath, "utf-8");

module.exports = solc.compile(source, 1).contracts;
module.exports = solc.compile(proxySource, 1).contracts;
