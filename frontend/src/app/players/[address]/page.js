import { Contract, JsonRpcProvider } from "ethers";
import playerAbi from "@/constants/abis/PlayerNFT.json";
import styles from "./PlayerDetailPage.module.css";
import Link from "next/link";

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);

export default async function PlayerDetailPage({ params }) {
  const { address } = params;

  try {
    // 🏀 Fetch player data from NFT contract
    const contract = new Contract(address, playerAbi.abi, provider);
    const [name, age, height, salary, image, highlight] = await Promise.all([
      contract.playerName(),
      contract.age(),
      contract.height(),
      contract.salaryRequest(),
      contract.imageURI(),
      contract.highlightUrl(),
    ]);

    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <img src={image} alt={name} className={styles.avatar} />
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.address}>{address}</p>
          <div className={styles.stats}>
            <p>Age: {age}</p>
            <p>Height: {height} cm</p>
            <p>Salary Request: {salary} BSKT</p>
          </div>
          <a
            href={highlight}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Watch Highlights
          </a>
        </div>
        <Link href="/">
          <button className={styles.backButton}>⬅ Back to Home</button>
        </Link>

      </main>
    );
  } catch (err) {
    console.error("❌ Error loading player details:", err);
    return (
      <div className="text-center text-red-600 py-10">
        Failed to load player details. Check the address.
      </div>
    );
  }
}
