import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // ✅ We are in the browser and MetaMask is available
  web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: "eth_requestAccounts" });
} else {
  // ❗ We are on the server or the user doesn't have Metamask
  const infuraUrl = process.env.NEXT_PUBLIC_INFURA_URL;

  if (!infuraUrl) {
    throw new Error("🚨 Missing NEXT_PUBLIC_INFURA_URL in .env.local");
  }

  const provider = new Web3.providers.HttpProvider(infuraUrl);
  web3 = new Web3(provider);
}

export default web3;
