import { JsonRpcProvider, Contract } from "ethers";
import TeamFactory from "@/constants/abis/TeamFactory.json";
import { contractAddresses } from "@/constants/contractAddresses";
import TeamABI from "@/constants/abis/TeamManager.json";


export async function getTeams() {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

  const contract = new Contract(
    contractAddresses.teamFactory,
    TeamFactory.abi,
    provider
  );

  try {
    const teams = await contract.getTeams(); // Adjust to your contract
    return teams;
  } catch (err) {
    console.error("Failed to fetch teams:", err);
    return [];
  }
}

export async function isTeamOwner(account) {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const teams = await getTeams();

  for (const teamAddress of teams) {
    try {
      const teamContract = new Contract(teamAddress, TeamABI.abi, provider);
      const owner = await teamContract.admin();
      if (owner.toLowerCase() === account.toLowerCase()) {
        return true;
      }
    } catch (err) {
      console.error(`Error checking team at ${teamAddress}:`, err);
    }
  }

  return false;
}