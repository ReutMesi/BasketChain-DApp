"use client";

import { useEffect, useState, use } from "react";
import { Contract, JsonRpcProvider, BrowserProvider, ethers } from "ethers";
import TeamManagerABI from "@/constants/abis/TeamManager.json";
import NFTABI from "@/constants/abis/PlayerNFT.json";
import SignRequestButton from "@/components/SignRequestButton";
import BoardApproveButton from "@/components/BoardApproveButton";
import FinalizeRequestButton from "@/components/FinalizeRequestButton";
import styles from "./teamPage.module.css";

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

export default function TeamPage({ params }) {
  const { address } = use(params);
  const [etherBalance, setEtherBalance] = useState("0");
  const [basketTokenBalance, setBasketTokenBalance] = useState("0");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userAddress, setUserAddress] = useState(null);
  const [isBoardMember, setIsBoardMember] = useState(false);
  const [isTeamOwner, setIsTeamOwner] = useState(false);

  const loadTeam = async () => {
    const contract = new Contract(address, TeamManagerABI.abi, provider);
    let signerAddress = null;

    if (window.ethereum) {
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      signerAddress = await signer.getAddress();
      setUserAddress(signerAddress);

      const isMember = await contract.isBoardMember(signerAddress);
      setIsBoardMember(isMember);

      const admin = await contract.admin();
      setIsTeamOwner(signerAddress.toLowerCase() === admin.toLowerCase());
    }

    try {
      const [eth, token] = await contract.getTeamBalances();
      setEtherBalance(`${Number(ethers.formatEther(eth)).toFixed(8)} ETH`);
      const tokenFormatted = ethers.formatUnits(token, 18);
      setBasketTokenBalance(tokenFormatted);

      const requestCount = await contract.getRequestsCount();
      const reqs = [];

      for (let i = 0; i < requestCount; i++) {
        const r = await contract.requests(i);
        const nftContract = new Contract(r.nftAddress, NFTABI.abi, provider);
        const nftOwner = await nftContract.owner();

        reqs.push({
          index: i,
          description: r.description,
          nftAddress: r.nftAddress,
          approvalCount: r.approvalCount.toString(),
          approvedByPlayer: r.approvedByPlayer,
          complete: r.complete,
          userOwnsNFT: nftOwner.toLowerCase() === signerAddress?.toLowerCase(),
        });
      }

      setRequests(reqs);
    } catch (err) {
      console.error("Error loading team:", err);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [address]);

  const joinBoard = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(address, TeamManagerABI.abi, signer);

      const tx = await contract.joinBoard({
        value: ethers.parseEther("0.0000001"),
      });
      await tx.wait();

      await loadTeam();
      alert("Joined board successfully!");
    } catch (err) {
      console.error("Join board failed:", err);
      alert("Failed to join board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        {/* Hero section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Team Manager</h1>
          <div className={styles.heroText}>
            <p><strong>Explore your team's blockchain dashboard:</strong></p>
            <ul>
              <li>Check ETH & BasketToken balances</li>
              <li>Join the board and vote on player signing requests</li>
              <li>Finalize contracts and manage decentralized team operations</li>
            </ul>
          </div>
        </section>

        {/* Team info */}
        <section>
          <p className={styles.address}><strong>Team Address:</strong> <span>{address}</span></p>
          <div>
            <p><strong>Ether Balance:</strong> {etherBalance}</p>
            <p><strong>BasketToken Balance:</strong> {basketTokenBalance} BSKT</p>
            <button
              className={styles.button}
              onClick={joinBoard}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Board (0.0000001 ETH)"}
            </button>
          </div>
        </section>

        {/* Signing Requests */}
        <section>
          <h2 className={styles.sectionTitle}>Signing Requests</h2>
          {requests.length === 0 ? (
            <p className={styles.noDataText}>No requests found.</p>
          ) : (
            <div className={styles.gridLayout}>
              {requests.map((r) => (
                <div
                  key={r.index}
                  className={`${styles.requestCard} ${
                    r.complete ? styles.completed : ""
                  }`}
                >
                  <p className={styles.nftAddress}>
                    <strong>NFT Address:</strong> {r.nftAddress}
                  </p>
                  <p><strong>Description:</strong> {r.description}</p>
                  <p><strong>Board Approvals:</strong> {r.approvalCount}</p>
                  <p><strong>Approved by Player:</strong> {r.approvedByPlayer ? "Yes" : "No"}</p>
                  <p><strong>Status:</strong> {r.complete ? "Finalized" : "Pending"}</p>

                  {!r.complete && r.userOwnsNFT && !r.approvedByPlayer && (
                    <SignRequestButton team={address} index={r.index} />
                  )}
                  {!r.complete && isBoardMember && (
                    <BoardApproveButton team={address} index={r.index} />
                  )}
                  {!r.complete && isTeamOwner && (
                    <FinalizeRequestButton
                      team={address}
                      index={r.index}
                      onFinalize={loadTeam}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
