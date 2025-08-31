# BaskeChain 🏀 (Basketball DApp)

**BaskeChain** is a decentralized application (DApp) that enables basketball players to register themselves, create player profiles as NFTs, and get signed by blockchain-registered teams using ERC20 tokens.

## 📦 Project Structure

```
BaskeChain/
│
├── ethereum/         # Hardhat backend with smart contracts
├── frontend/         # Next.js + React frontend with Ethers.js integration
└── README.md         # This file
```

---

## 🔧 Tech Stack

### Blockchain
- [Solidity](https://soliditylang.org/) – Smart contract language
- [Hardhat](https://hardhat.org/) – Compile, test, and deploy contracts
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/) – Secure ERC20 & ERC721 base
- [Ethers.js](https://docs.ethers.org/) – Contract interaction
- Sepolia Testnet – Deployment environment

### Frontend
- [Next.js](https://nextjs.org/) – React framework
- [React](https://react.dev/) – UI components
- [TailwindCSS](https://tailwindcss.com/) + [ShadCN](https://ui.shadcn.com/) – Modern UI
- [MetaMask](https://metamask.io/) – Wallet integration

---

## 🚀 Features

- **PlayerNFT (ERC721):**
  - Unique NFT per player
  - Stores: name, age, height, salary request, image URI, and highlight video link
- **BasketToken (ERC20):**
  - Used by teams to sign players
  - Initial allocation per team
- **TeamManager Contract:**
  - `createTeam(...)` → register a new team  
  - `registerPlayer(...)` → mint a PlayerNFT  
  - `signPlayer(...)` → team signs a player (ERC20 transfer + status update)  
  - `releasePlayer(...)` → cancel a contract  
  - `getTeamStatus(...)` → view roster + remaining budget
- **Frontend (Next.js + Ethers.js):**
  - Player and Team registration forms
  - Display all players & teams
  - Signing flow via MetaMask
  - Team dashboards with signed players & budget

---

## ⚙️ How to Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/BaskeChain.git
cd BaskeChain
```

### 2. Install Smart Contract Dependencies
```bash
cd ethereum
npm install
```

### 3. Compile & Test Contracts
```bash
npx hardhat compile
npx hardhat test
```

### 4. Start Local Blockchain (Optional)
```bash
npx hardhat node
```

### 5. Deploy Contracts
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Run the Frontend
```bash
cd ../frontend
npm install
npm start
```

> Make sure Metamask is connected to the same network used in Hardhat (usually `http://127.0.0.1:8545`) and uses an account with test ETH.

---

## 🐞 Known Issues & Limitations

- Signature requests are not visible in player view yet
- No ETH cost for creating teams/players (could be spammed)
- Multi-account access (Metamask) has inconsistencies
- Role-based UI (player/team views) not fully implemented
- NFT transfer/ownership updates could be improved

---

## 📈 Future Improvements

- Role-based UI (player vs. team dashboards)
- Player-controlled signing approvals (two-step acceptance)
- Add transaction cost for creating teams/players
- Advanced governance mechanisms for team boards
- Enhanced error handling & UX

## 📬 Contact

For any questions, feel free to reach out via email or GitHub issues.
