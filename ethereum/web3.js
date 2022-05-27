import Web3 from "web3";

let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    // "https://rinkeby.infura.io/v3/559558ff318e4abf858994f84250026a",
    "https://rinkeby.infura.io/v3/427b8fa5d841409aa68fe30f9b6f00d4",

  );
  web3 = new Web3(provider);
}

export default web3;