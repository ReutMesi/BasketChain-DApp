"use client";

import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { toast } from "sonner";
import TeamManagerABI from "@/constants/abis/TeamManager.json";

export default function JoinBoardButton({ teamAddress }) {
  const handleJoin = async () => {
    if (!window.ethereum) {
      return toast.error("Please install MetaMask");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      teamAddress,
      TeamManagerABI.abi,
      signer
    );

    try {
      const tx = await contract.joinBoard({
        value: ethers.parseEther("0.1"),
      });
      await tx.wait();
      toast.success("Joined the board!");
    } catch (err) {
      console.error("Failed to join board:", err);
      toast.error("Transaction failed");
    }
  };

  return (
    <Button onClick={handleJoin} className="mt-6">
      Join Board (0.1 ETH)
    </Button>
  );
}
