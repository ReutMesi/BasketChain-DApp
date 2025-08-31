"use client";

import { Contract, BrowserProvider } from "ethers";
import { useState } from "react";
import { contractAddresses } from "@/constants/contractAddresses";
import teamFactoryAbi from "@/constants/abis/TeamFactory.json";

const factoryAddress = contractAddresses.teamFactory;

export default function CreateTeamButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateTeam = async () => {
    if (!window.ethereum) {
      return alert("Please install MetaMask.");
    }

    try {
      setLoading(true);
      setMessage("");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(factoryAddress, teamFactoryAbi.abi, signer);
      const tx = await contract.createTeam();
      await tx.wait();

      setMessage("✅ Team created successfully!");
      window.location.reload(); // Optional: refresh to see new team on home
    } catch (err) {
      console.error("❌ Team creation failed:", err);
      setMessage("❌ Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <button
        onClick={handleCreateTeam}
        disabled={loading}
        style={{
          padding: "12px 24px",
          backgroundColor: loading ? "#ccc" : "#4f46e5",
          color: "white",
          fontSize: 16,
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "➕ Create New Team"}
      </button>
      {message && <p style={{ marginTop: 12, color: message.includes("failed") ? "red" : "green" }}>{message}</p>}
    </div>
  );
}
