const HDWalletProvider = require('truffle-hdwallet-provider');//se encarga de la conexion con la BC
const Web3 = require('web3');//para trabajar con SC
//const {interface, bytecode } = require('./compile');

const contracts = require('./compile');
console.log("contracts ", contracts);

//mi cuenta
const provider = new HDWalletProvider(
    'accident soul machine super umbrella hockey such brown ready napkin tennis infant',
    'https://rinkeby.infura.io/v3/cea17b48f08f4388937ce7c8004a3a98'
);


const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(contracts.campaign.interface))
        .deploy({ data: contract.campaign.bytecode, arguments: ['We are starting our Campaing!!!!']})
        .send({ gas: 5000000, from: accounts[0]});

    console.log('Contract deploy to ', result.options.address);
};

deploy();