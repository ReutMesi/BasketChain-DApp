"use client";

import { Contract, BrowserProvider } from "ethers";
import teamABI from "@/constants/abis/TeamManager.json";
import styles from "./BoardApproveButton.module.css"; // optional styling

export default function BoardApproveButton({ team, index }) {
  const handleApprove = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(team, teamABI.abi, signer);

      const tx = await contract.approveRequest(index);
      await tx.wait();

      alert("✅ Successfully approved request!");
      window.location.reload();
    } catch (err) {
      console.error("❌ Approval failed:", err);
      alert("❌ Error approving request.");
    }
  };

  return (
    <button className={styles.button} onClick={handleApprove}>
      Board Approve
    </button>
  );
}
