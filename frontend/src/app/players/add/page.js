"use client";

import { useState } from "react";
import AddPlayerForm from "@/components/AddPlayerForm";
import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  const [message, setMessage] = useState("");

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Player Manager</h1>
        <p className={styles.subtitle}>
          Register a new player and mint their NFT profile on-chain.
        </p>
      </section>

      <AddPlayerForm setMessage={setMessage} />

      {message.includes("successfully") && (
        <Link href="/">
          <button className={styles.backButton}>⬅ Back to Home</button>
        </Link>
      )}
    </main>
  );
}
