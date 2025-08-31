import web3 from "./web3";
import TeamFactory from "@/constants/abis/TeamFactory.json";
import { contractAddresses } from "@/constants/contractAddresses";

const instance = new web3.eth.Contract(
  TeamFactory.abi,
  contractAddresses.teamFactory
);

export default instance;
