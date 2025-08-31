"use client";

import { Contract, BrowserProvider } from "ethers";
import teamABI from "@/constants/abis/TeamManager.json";
import styles from "./SignRequestButton.module.css"; // Optional styling

export default function SignRequestButton({ team, index }) {
  const handleClick = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(team, teamABI.abi, signer);

      const tx = await contract.playerApprove(index);
      await tx.wait();

      alert("✅ Successfully signed request!");
      window.location.reload();
    } catch (err) {
      console.error("❌ Signing failed:", err);
      alert("❌ Error signing request.");
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      Sign Request
    </button>
  );
}
