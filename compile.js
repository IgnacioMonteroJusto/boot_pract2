const path = require("path");
const fs = require("fs");
const solc = require("solc");

//con esta variable nos posicionamos desde la raiz del proyecto hasta inbox.sol
const inboxPath = path.resolve(__dirname, "contracts", "campaign.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

module.exports = solc.compile(source, 1).contracts[":Campaign"];