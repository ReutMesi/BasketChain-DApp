import { JsonRpcProvider, Contract } from "ethers";
import PlayerFactory from "@/constants/abis/PlayerNFTFactory.json";
import { contractAddresses } from "@/constants/contractAddresses";

export async function getPlayers() {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

  const contract = new Contract(
    contractAddresses.playerFactory,
    PlayerFactory.abi,
    provider
  );

  try {
    const players = await contract.getAllNFTs(); // must return address[]
    return players;
  } catch (err) {
    console.error("Failed to fetch players:", err);
    return [];
  }
}
