require('events').EventEmitter.defaultMaxListeners = 20;//THIS IS USED TO AVOID A NODE MAXLISTENERS ERROR!!!!!!!
/*********************************************************************************************************/
const assert = require('assert');
const ganache = require('ganache-cli');//provider para BC privado. Parecido al JVM de Remix para no gastar ether
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());//instanciamos web3 que es el motor para acceder a la BC

const contracts = require('../compile');//importamos ABI y BYTECODE de campaign

console.log("CONTRACTS -> ", contracts);
//console.log("CAMPAIGN -> ", contracts.token);

const {interface, bytecode } = contracts.campaign;
const interfaceProxy  = contracts.proxy.interface;
const bytecodeProxy  = contracts.proxy.bytecode;
const interfaceToken  = contracts.token.interface;
const bytecodeToken  = contracts.token.bytecode;


//console.log("INTERFACE -> ", interface);
//console.log("BYTECODE -> ", bytecode);

let accounts;//creamos variable general para tener los wallets cargados
let inbox;
/*
beforeEach(async () => {
    //Get all accounts
    accounts = await web3.eth.getAccounts();
    console.log("ACCOUNTS = ", accounts);

    //Use one of those account to deploy de contract
    campaign = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode
            //arguments: ['Hi, there']
        })
        .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans

    console.log('Contract campaign deploy to ', campaign.options.address);


});
*/


describe('Campaign', () =>{

    before(async () => {
        //Get all accounts
        accounts = await web3.eth.getAccounts();

        token = await new web3.eth.Contract(JSON.parse(interfaceToken))
            .deploy({
                data: bytecodeToken
                //arguments: [campaign.options.address]
            })
            .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans

        console.log('Contract token deploy to ', token.options.address);

        //Use one of those account to deploy de contract
        campaign = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({
                data: bytecode,
                arguments: [token.options.address]
            })
            .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans

        console.log('Contract campaign deploy to ', campaign.options.address);

        proxy = await new web3.eth.Contract(JSON.parse(interfaceProxy))
            .deploy({
                data: bytecodeProxy,
                arguments: [campaign.options.address]
            })
            .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans

        console.log('Contract proxy deploy to ', proxy.options.address);

    });

    it('Deploys a contract', () => {
        assert(campaign.options.address);
    });

    it('Has manager', async () => {

        const manager = await campaign.methods.manager().call();//para una llamada no hace falta pasar param extras
        assert(manager);
    });

    it('Can create request', async () => {

        const manager = await campaign.methods.manager().call();//para una llamada no hace falta pasar param extras
        const address = "0xC1C24B4ece6059fF5f17156C952deB098E552D21";

        await campaign.methods.createRequest('proy 1', 12, address).send({ from: accounts[0], gas: "1000000" });//acaba en punto send porque envía una trans
        const request = await campaign.methods.requests(0).call();
        //console.log(request);
        assert(request);
    });

    it('can contribute', async () => {
        const manager = await campaign.methods.manager().call();//para una llamada no hace falta pasar param extras

        await campaign.methods.contribute().send({ from: accounts[0], value: "500000000000000001" });//para una llamada no hace falta pasar param extras
        //const approvers = await campaign.methods.numApprovers().call();//para una llamada no hace falta pasar param extras
        //assert.equal(approvers, 1);
    });

    it('Has approvers', async () => {

        const approvers = await campaign.methods.numApprovers().call();//para una llamada no hace falta pasar param extras
        assert(approvers);
    });

    it('Has token address', async () => {

        const tokenadd = await campaign.methods.getTokenAddress().call();//para una llamada no hace falta pasar param extras
        assert(tokenadd);
    });


});

describe('Proxy', () =>{
    it('Deploys a proxy contract', () => {
        assert.ok(proxy.options.address);
    });
    it('Has proxyAddres', async () => {
        const manager = await proxy.methods.proxyAddress().call();//para una llamada no hace falta pasar param extras
        assert.ok(proxy.options.address);
    });
});

describe('Token', () =>{
    it('Deploys a token contract', () => {
        assert.ok(token.options.address);
    });
});