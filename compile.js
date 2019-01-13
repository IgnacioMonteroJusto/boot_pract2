const path = require("path");
const fs = require("fs");
const solc = require("solc");

//con esta variable nos posicionamos desde la raiz del proyecto hasta inbox.sol
const inboxPath = path.resolve(__dirname, "contracts", "campaign.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

const inboxProxyPath = path.resolve(__dirname, "contracts", "proxy.sol");
const sourceProxy = fs.readFileSync(inboxProxyPath, "utf-8");

const inboxTokenPath = path.resolve(__dirname, "contracts", "firsttoken.sol");
const sourceToken = fs.readFileSync(inboxTokenPath, "utf-8");

//console.log("source Camp = ", source);
//console.log("source token = ", sourceToken);

//module.exports = solc.compile(source, 1).contracts; //esto funciona bien con un fichero
module.exports = {
    campaign: solc.compile(source, 1).contracts[":Campaign"],
    proxy: solc.compile(sourceProxy, 1).contracts[":Proxy"],
    token: solc.compile(sourceToken, 1).contracts[":FirstToken"]
};
