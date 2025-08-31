import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and MetaMask is running
  web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: "eth_requestAccounts" });
} else {
  // We are on the server *OR* the user is not running MetaMask
  const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/17c6e9a227484459bdeba2ca8fa75125");
  web3 = new Web3(provider);
}

export default web3;