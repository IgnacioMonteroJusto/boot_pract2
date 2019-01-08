require('events').EventEmitter.defaultMaxListeners = 20;//THIS IS USED TO AVOID A NODE MAXLISTENERS ERROR!!!!!!!
/*********************************************************************************************************/
const assert = require('assert');
const ganache = require('ganache-cli');//provider para BC privado. Parecido al JVM de Remix para no gastar ether
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());//instanciamos web3 que es el motor para acceder a la BC

const aux = require('../compile');//importamos ABI y BYTECODE de campaign
//const { interface, bytecode } = aux;
const interfaceProxy = aux[":Proxy"]

let accounts;//creamos variable general para tener los wallets cargados
let inbox;

//console.log("Contract Compiled ", aux);

beforeEach(async () => {
    //Get all accounts
    accounts = await web3.eth.getAccounts();

    //Use one of those account to deploy de contract
    proxy = await new web3.eth.Contract(JSON.parse(interfaceProxy))
        .deploy({
            data: bytecode
            //arguments: ['Hi, there']
        })
        .send({ from: accounts[0], gas: "5000000"});//acaba en punto send porque envía una trans
});

describe('Proxy', () =>{
    it('Deploys a contract', () => {
        assert.ok(proxy.options.address);
    });

    it('Has address', async () => {


    });

    it('Can create request', async () => {

    });

    it('can contribute', async () => {


    });

    it('Has approvers', async () => {


    });
});