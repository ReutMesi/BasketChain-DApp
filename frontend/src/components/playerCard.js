"use client";

import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider, BrowserProvider, ethers } from "ethers";
import playerAbi from "@/constants/abis/PlayerNFT.json";
import teamManagerAbi from "@/constants/abis/TeamManager.json";
import styles from "./PlayerCard.module.css";

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

export default function PlayerCard({ address, teamManagerAddress }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const contract = new Contract(address, playerAbi.abi, provider);
        const [name, age, height, salary, image, highlight] = await Promise.all([
          contract.playerName(),
          contract.age(),
          contract.height(),
          contract.salaryRequest(),
          contract.imageURI(),
          contract.highlightUrl(),
        ]);

        setData({ name, age, height, salary, image, highlight });
      } catch (err) {
        console.error(`Failed to load player at ${address}:`, err);
      }
    };

    loadPlayer();
  }, [address]);

  const handleCreateRequest = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      setLoading(true);
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();

      const contract = new Contract(teamManagerAddress, teamManagerAbi.abi, signer);

      const tx = await contract.createRequest(`Sign player ${data.name}`, address);
      await tx.wait();

      alert("Request created successfully!");
    } catch (err) {
      console.error("Failed to create request:", err);
      alert("Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return <div className={styles.card}>Loading player data...</div>;
  }

  return (
    <div className={styles.card}>
      <img src={data.image} alt={data.name} className={styles.avatar} />
      <h3 className={styles.name}>{data.name}</h3>
      <p className={styles.address}>{address}</p>

      <div className={styles.info}>
        <p><strong>Age:</strong> {data.age}</p>
        <p><strong>Height:</strong> {data.height} cm</p>
        <p><strong>Salary:</strong> {ethers.formatEther(data.salary)} ETH</p>
      </div>

      <a
        href={data.highlight}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        ▶ Watch Highlights
      </a>

      <button
        onClick={handleCreateRequest}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Creating..." : "Request Signing"}
      </button>
    </div>
  );
}
