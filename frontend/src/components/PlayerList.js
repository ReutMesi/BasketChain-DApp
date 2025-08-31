"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddresses } from "@/constants/contractAddresses";
import playerFactoryAbi from "@/constants/abis/PlayerNFTFactory.json";
import PlayerCardSummary from "@/components/PlayerCardSummary";

const factoryAddress = contractAddresses.playerFactory;

export default function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(factoryAddress, playerFactoryAbi.abi, provider);

      try {
        const addresses = await contract.getAllNFTs();
        setPlayers(addresses);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
  {players.map((address, i) => (
    <PlayerCardSummary key={i} address={address} />
  ))}
</div>
  );
}
