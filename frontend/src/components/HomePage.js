"use client";

import { useEffect, useState } from "react";
import { isTeamOwner, getTeams } from "@/lib/getTeams";
import { getPlayers } from "@/lib/getPlayers";
import TeamCard from "@/components/TeamCard";
import PlayerCardSummary from "@/components/PlayerCardSummary";
import styles from "./page.module.css";

export default function HomeClient() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [teamsList, playersList] = await Promise.all([
        getTeams(),
        getPlayers(),
      ]);
      setTeams(teamsList);
      setPlayers(playersList);

      if (typeof window.ethereum !== "undefined") {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const result = await isTeamOwner(account);
        setIsOwner(result);
      }
    }

    fetchData();
  }, []);

  return (
    <main className={styles["page-container"]}>
      <div className={styles["page-wrapper"]}>
        <section className={styles.hero}>
          <h1 className={styles["hero-title"]}>Welcome to BasketChain 🏀</h1>
          <p className={styles["hero-text"]}>
            Discover basketball teams, explore player NFTs, and interact with smart contracts — all on-chain.
          </p>
          {isOwner && (
            <button className={styles["owner-button"]}>➕ Create New Player</button>
          )}
        </section>

        <section>
          <h2 className={styles["section-title"]}>Registered Teams</h2>
          {teams.length === 0 ? (
            <p className={styles["no-data-text"]}>No teams found.</p>
          ) : (
            <div className={styles["grid-layout"]}>
              {teams.map((address, i) => (
                <TeamCard key={i} address={address} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className={styles["section-title"]}>Registered Players</h2>
          {players.length === 0 ? (
            <p className={styles["no-data-text"]}>No players found.</p>
          ) : (
            <div className={styles["grid-layout"]}>
              {players.map((address, i) => (
                <PlayerCardSummary key={i} address={address} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
