"use client";

import { useEffect, useState } from "react";
import { isTeamOwner, getTeams } from "@/lib/getTeams";
import TeamABI from "@/constants/abis/TeamManager.json";
import { Contract, BrowserProvider } from "ethers";
import styles from "./RequestButton.module.css";


export default function RequestButton() {
  const [isOwner, setIsOwner] = useState(false);
  const [teamAddress, setTeamAddress] = useState(null);

  useEffect(() => {
    async function checkOwnership() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const teams = await getTeams();
          const provider = new BrowserProvider(window.ethereum);

          for (const addr of teams) {
            const contract = new Contract(addr, TeamABI.abi, provider);
            const owner = await contract.admin();
            if (owner.toLowerCase() === account.toLowerCase()) {
              setIsOwner(true);
              setTeamAddress(addr);
              break;
            }
          }
        } catch (err) {
          console.error("Failed to check team ownership:", err);
        }
      }
    }

    checkOwnership();
  }, []);

  async function handleClick() {
    const description = prompt("Enter request description:");
    const nftAddress = prompt("Enter player NFT address:");

    if (!description || !nftAddress) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(teamAddress, TeamABI.abi, signer);

      const tx = await contract.createRequest(description, nftAddress);
      await tx.wait();
      alert("Request created successfully!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Request failed.");
    }
  }

  if (!isOwner) return null;

  return (
    <button className={styles.ownerButton} onClick={handleClick}>
      ➕ Create Sign Request
    </button>
  );
}
