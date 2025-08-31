"use client";

import { Contract, BrowserProvider } from "ethers";
import teamABI from "@/constants/abis/TeamManager.json";
import styles from "./FinalizeRequestButton.module.css";

export default function FinalizeRequestButton({ team, index, onFinalize }) {
  const handleFinalize = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(team, teamABI.abi, signer);

      const tx = await contract.finalizeRequest(index);
      await tx.wait();

      alert("✅ Finalized!");
      if (onFinalize) await onFinalize(); // 🔄 refresh balance
    } catch (err) {
      console.error("❌ Finalize failed:", err);
      alert("❌ Could not finalize.");
    }
  };

  return (
    <button className={styles.button} onClick={handleFinalize}>
      Finalize Signing
    </button>
  );
}
