"use client";

import Link from "next/link";
import styles from "./TeamCard.module.css";

export default function TeamCard({ address }) {
  return (
    <div className={styles.card}>
      <p className={styles.address}>
        <strong>Team Address:</strong> 
        <span>{address}</span>
      </p>
      <Link href={`/teams/${address}`} className={styles.button}>
        View
      </Link>
    </div>
  );
}
