"use client";

import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import playerAbi from "@/constants/abis/PlayerNFT.json";
import Link from "next/link";
import styles from "./PlayerCardSummary.module.css";

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

export default function PlayerCardSummary({ address }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const contract = new Contract(address, playerAbi.abi, provider);
        const [name, imageURI, height] = await Promise.all([
          contract.playerName(),
          contract.imageURI(),
          contract.height(),
        ]);

        setData({ name, imageURI, height });
      } catch (err) {
        console.error(`Failed to load player summary at ${address}:`, err);
      }
    };

    load();
  }, [address]);

  if (!data) {
    return <div className={styles.card}>Loading...</div>;
  }

  return (
    <Link href={`/players/${address}`} className={styles.link}>
      <div className={styles.card}>
        <img
          src={data.imageURI}
          alt={data.name}
          className={styles.avatar}
        />
        <h3 className={styles.name}>{data.name}</h3>
        <p className={styles.detail}>Height: {data.height} cm</p>
      </div>
    </Link>
  );
}
