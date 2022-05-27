import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  ContractFactory.abi,
  // Generated abi after run command node deploy.js
  // Attempting to deploy from account 0x01e08080fBd94DB7A077c1972378a6EaFBdD7eb7
  // Contract deployed to 0x478a3eC2E7ea42bf1A0FF744506780A460ebd952

  // Old abi
  // "0x5Ce73d75E9964Bc2f45c445A2258bB084d299386"

  // New abi
    "0x478a3eC2E7ea42bf1A0FF744506780A460ebd952"

);
export default instance;
// 0xdA5B5AfA46C2A04cabc2A132D3d35F06F3918b9c
