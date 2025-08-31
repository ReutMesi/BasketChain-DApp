"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { contractAddresses } from "@/constants/contractAddresses";
import playerFactoryAbi from "@/constants/abis/PlayerNFTFactory.json";
import styles from "./AddPlayerForm.module.css";

const playerFactoryAddress = contractAddresses.playerFactory;

const fields = [
  { name: "nftName", label: "NFT Name" },
  { name: "nftSymbol", label: "NFT Symbol" },
  { name: "name", label: "Full Name" },
  { name: "age", label: "Age", type: "number" },
  { name: "height", label: "Height (cm)", type: "number" },
  { name: "salaryRequest", label: "Salary Request (BSKT)", type: "number" },
  { name: "imageURI", label: "Image URI" },
  { name: "highlightUrl", label: "Highlight Video URL" },
];

export default function AddPlayerForm({ setMessage }) {
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(fields.map(f => [f.name, ""]))
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      return setMessage("Please install MetaMask");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length === 0) {
      return setMessage("Please connect your MetaMask wallet");
    }

    const signer = await provider.getSigner();
    const factory = new ethers.Contract(
      playerFactoryAddress,
      playerFactoryAbi.abi,
      signer
    );

    try {
      setLoading(true);
      setMessage("");
      const tx = await factory.createPlayerNFT(
        formData.nftName,
        formData.nftSymbol,
        formData.name,
        parseInt(formData.age),
        parseInt(formData.height),
        parseInt(formData.salaryRequest),
        formData.imageURI,
        formData.highlightUrl
      );
      await tx.wait();
      setMessage("✅ Player NFT created successfully!");
      setFormData(() => Object.fromEntries(fields.map(f => [f.name, ""])));
    } catch (err) {
      console.error(err);
      setMessage("❌ Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>Register New Player NFT</h2>

      {fields.map(({ name, label, type = "text" }) => (
        <div key={name} className={styles.formGroup}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            required
            placeholder={label}
            value={formData[name]}
            onChange={handleChange}
          />
        </div>
      ))}

      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Creating..." : "Create Player"}
      </button>
    </form>
  );
}
