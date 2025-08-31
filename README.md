# BaskeChain 🏀 (Basketball DApp)

**BaskeChain** is a decentralized application (DApp) that enables basketball players to register themselves, create player profiles as NFTs, and get signed by blockchain-registered teams using ERC20 tokens.

## 📦 Project Structure

```
BaskeChain/
│
├── ethereum/         # Hardhat backend with smart contracts
├── frontend/         # React-based frontend with Web3 integration
└── README.md         # This file
```

---

## 🔧 Technologies Used

### Blockchain (Ethereum)
- [Hardhat](https://hardhat.org/) – development environment and testing
- [Solidity](https://soliditylang.org/) – smart contract language
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/) – for secure ERC20 and NFT implementation
- [Ethers.js](https://docs.ethers.org/) – Web3 interaction from frontend

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/) (or Create React App, depending on setup)
- [Web3.js](https://web3js.readthedocs.io/) or Ethers.js – for blockchain interaction
- [Metamask](https://metamask.io/) – wallet integration

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

## 📄 Smart Contract Summary

### PlayerNFT (ERC721)
- Unique NFT per player
- Stores: name, age, height, salary request, position, image URI, and highlight video link

### BasketToken (ERC20)
- Team currency for signing players
- Fixed initial supply for each team

### TeamManager
- `createTeam(...)` – Register a new team
- `registerPlayer(...)` – Mint a new PlayerNFT
- `signPlayer(...)` – Team signs a player using BasketToken
- `releasePlayer(...)` – Cancel a signed contract
- `getTeamStatus(...)` – Retrieve team budget and player list

---

## 🐞 Known Issues & Limitations

See full list in the project presentation, but in brief:
- Signature requests are not visible in player view yet
- No ETH cost for creating teams/players (could be spammed)
- Multi-account access (Metamask) has inconsistencies
- Role-based UI (player/team views) not fully implemented
- NFT transfer/ownership updates could be improved

---

## 📈 Future Improvements

- Add ETH or token-based cost to create teams/players
- Full role-based UI (player vs team)
- Allow player to approve/reject signing requests
- Better NFT metadata update & ownership control
- Cleaner UX and error handling

---

## 📬 Contact

For any questions, feel free to reach out via email or GitHub issues.
