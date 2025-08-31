"use client";

import { useEffect, useState } from "react";
import { Contract, BrowserProvider, JsonRpcProvider } from "ethers";
import TeamFactory from "@/constants/abis/TeamFactory.json";
import TeamABI from "@/constants/abis/TeamManager.json";
import SignRequestButton from "./SignRequestButton";
import { contractAddresses } from "@/constants/contractAddresses";
import styles from "./PlayerRequestsView.module.css";

const factoryAddress = contractAddresses.teamFactory; // Use the correct factory address from constants

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const rpcUrl = process.env.NEXT_PUBLIC_INFURA_URL;

export default function PlayerRequestsView({ playerAddress }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      const provider = new JsonRpcProvider(rpcUrl);
      const factory = new Contract(factoryAddress, TeamFactory.abi, provider);

      try {
        const teamAddresses = await factory.getTeams();
        const matched = [];

        for (const teamAddress of teamAddresses) {
          try {
            const teamContract = new Contract(teamAddress, TeamABI.abi, provider);
            const allRequests = await teamContract.getAllRequests();

            allRequests.forEach((req, index) => {
              if (req.nftAddress?.toLowerCase() === playerAddress.toLowerCase()) {
                matched.push({
                  description: req.description,
                  team: teamAddress,
                  complete: req.complete,
                  approvalCount: Number(req.approvalCount),
                  approvedByPlayer: req.approvedByPlayer,
                  index,
                });
              }
            });

            await sleep(150); // ✅ Rate limit friendly
          } catch (err) {
            console.warn(`❌ Skipping team ${teamAddress}:`, err);
          }
        }

        setRequests(matched);
      } catch (err) {
        console.error("❌ Failed to load player requests:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [playerAddress]);

  if (loading) return <p>Loading player requests...</p>;

  return (
    <section>
      <h2>Sign Requests for this Player</h2>
      {requests.length === 0 ? (
        <p>No sign requests yet.</p>
      ) : (
        <ul>
          {requests.map((req, idx) => (
            <li key={idx}>
              <p>
                <strong>{req.description}</strong> <br />
                From Team: <code>{req.team}</code> <br />
                Status: {req.complete ? "✅ Finalized" : "⏳ Pending"} <br />
                Approvals: {req.approvalCount} <br />
                Player Approved: {req.approvedByPlayer ? "✅ Yes" : "❌ No"}
              </p>
              {!req.approvedByPlayer && !req.complete && (
                <SignRequestButton team={req.team} index={req.index} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
