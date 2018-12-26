require('events').EventEmitter.defaultMaxListeners = 15;//THIS IS USED TO AVOID A NODE MAXLISTENERS ERROR!!!!!!!
/*********************************************************************************************************/
const assert = require('assert');
const ganache = require('ganache-cli');//provider para BC privado. Parecido al JVM de Remix para no gastar ether
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());//instanciamos web3 que es el motor para acceder a la BC

const aux = require('../compile');//importamos ABI y BYTECODE de campaign
const { interface, bytecode } = aux;

let accounts;//creamos variable general para tener los wallets cargados
let inbox;

//console.log("Contract Compiled ", aux);

beforeEach(async () => {
    //Get all accounts
    accounts = await web3.eth.getAccounts();

    //Use one of those account to deploy de contract
    campaign = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode
            //arguments: ['Hi, there']
        })
        .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans
});

describe('Campaign', () =>{
    it('Deploys a contract', () => {
        assert.ok(campaign.options.address);
    });

    it('Has manager', async () => {

        const manager = await campaign.methods.manager().call();//para una llamada no hace falta pasar param extras
        assert(manager);
    });

    it('Can create request', async () => {
        const address = "0xC1C24B4ece6059fF5f17156C952deB098E552D21";
        await campaign.methods.createRequest('proy 1', 12, address).send({ from: accounts[0], gas: "1000000" });//acaba en punto send porque envía una trans
        const request = await campaign.methods.requests(0).call();
        console.log(request);
        assert(request);
    });

    it('Has approvers', async () => {

        const approvers = await campaign.methods.numApprovers().call();//para una llamada no hace falta pasar param extras
        assert(approvers);
    });
});