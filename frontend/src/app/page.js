import { getTeams } from "@/lib/getTeams";
import TeamCard from "@/components/TeamCard";
import { getPlayers } from "@/lib/getPlayers";
import PlayerCardSummary from "@/components/PlayerCardSummary";
import RequestButton from "@/components/RequestButton";
import CreateTeamButton from "@/components/CreateTeamButton";
import Link from "next/link";
import styles from "./page.module.css"; // 👈 import your styles

export default async function Page() {
  const teams = await getTeams();
  const players = await getPlayers();

  return (
    <main className={styles["page-container"]}>
      <div className={styles["page-wrapper"]}>
        {/* 👋 Welcome Section */}
        <section className={styles.heroBanner}>
  <div className={styles.hero}>
    <h1 className={styles["hero-title"]}>Welcome to BasketChain 🏀</h1>
    <p className={styles["hero-text"]}>
      Discover basketball teams, explore player NFTs, and interact with smart contracts — all on-chain.
    </p>
  </div>
</section>

        {/* 📋 Registered Teams */}
        <section>
          <div className={styles["section-header"]}>
  <h2 className={styles["section-title"]}>Registered Teams</h2>
  <CreateTeamButton />
</div>

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

        {/* 🎽 Registered Players */}
        <section>
          <div className={styles["section-header"]}>
  <h2 className={styles["section-title"]}>Registered Players</h2>
  <Link href="/players/add">
    <button className={styles["actionButton"]}>📝 Register New Player</button>
  </Link>
</div>
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
        <div className={styles.requestButtonContainer}>
  <RequestButton />
</div>
      </div>
    </main>
  );
}

