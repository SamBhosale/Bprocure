// using mnemonic to access account
// we can use this web3 instance to deploy contract

// in lottery we imported interface and bytecode from compiled file

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// we will not directly deploy the campaign contract but
// will firstly deploy camapaignFactory which will deploy our further contracts
const compiledFactory = require("./build/ContractFactory.json");

const provider = new HDWalletProvider(
  // "tube tobacco goat adjust soul adjust surface consider room apart mask erosion",
  "purpose tower artist seek basket dentist tube nature exit barely bargain surge",

  // remember to change this to your own phrase!
  // "https://rinkeby.infura.io/v3/559558ff318e4abf858994f84250026a"
  "https://rinkeby.infura.io/v3/427b8fa5d841409aa68fe30f9b6f00d4",

  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();
