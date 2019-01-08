const path = require("path");
const fs = require("fs");
const solc = require("solc");

//con esta variable nos posicionamos desde la raiz del proyecto hasta inbox.sol
const inboxPath = path.resolve(__dirname, "contracts", "campaign.sol");
//const inboxPath = path.resolve(__dirname, "contracts", "campaign.sol");
const source = fs.readFileSync(inboxPath, "utf-8");



/*const source = async.eachSeries(
    // Pass items to iterate over
    ['campaign.sol', 'proxy.sol'],
    // Pass iterator function that is called for each item
    function(filename, cb) {
        fs.readFile(filename, function(err, content) {
            if (!err) {
                response.write(content);
            }

            // Calling cb makes it go to the next item.
            cb(err);
        });
    }
);*/

module.exports = solc.compile(source, 1).contracts[":Campaign"];
