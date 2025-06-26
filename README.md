# ☕ Buy Me A Coffee dApp

A decentralized "Buy Me a Coffee" application that allows supporters to send ETH to the contract owner as a fun way of saying thanks.  
This fully functional dApp is **visually built with Bolt.new (Vibe Coding)** for the frontend and uses a Solidity smart contract deployed on the **Ethereum Sepolia testnet**.

Users can:
- Connect their MetaMask wallet
- View their ETH balance
- Send 0.005, 0.01, 0.025, or 0.05 ETH
- Or enter a custom ETH amount

---

## 🌟 Features

- 🔗 Connect/Disconnect MetaMask
- 💼 Display connected wallet address and balance
- ☕ Pre-set donation options (0.005–0.05 ETH)
- ✏️ Custom ETH donation input
- 📝 Prompt for MetaMask confirmation
- 🧠 Smart contract deployed on Sepolia
- 💻 Frontend built with **Bolt.new** + JavaScript using `viem`

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|---------------|------------------------------------|
| Blockchain    | Ethereum (Sepolia Testnet)         |
| Smart Contract| Solidity                           |
| Development   | Hardhat or Remix                   |
| Frontend      | Bolt.new (Vibe Coding)             |
| Web3 Library  | `viem` (lightweight EVM toolkit)   |
| Wallet        | MetaMask                           |
| Runtime       | Node.js                            |

---

## 🚀 Smart Contract Deployment (Sepolia)

### Step 1: Compile Contract

- npx hardhat compile

### Step 2: Add Sepolia to hardhat.config.js

```js
sepolia: {
  url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  accounts: ["0xYOUR_PRIVATE_KEY"]
}
```
⚠️ Use .env for private key protection

### Step 3: Deploy Contract

- npx hardhat run scripts/deploy.js --network sepolia

### ✅ Alternate: Use Remix

1. **Compile** your Solidity file  
2. **Switch environment** to `Injected Web3` (MetaMask)  
3. **Deploy** the contract to the **Sepolia** testnet  
4. **Copy** the deployed **contract address** and **ABI** for frontend integration


### 🦊 MetaMask Setup
- Install MetaMask

- Add Sepolia testnet (Chain ID: 11155111)

Get test ETH from Sepolia Faucet

Connect wallet in the dApp

### 💻 Frontend Setup (Local)

git clone https://github.com/bkoushik11/Buy-Me-A-Coffee.git
cd Buy-Me-A-Coffee
npm install
npm run dev
Visit: http://localhost:5173

Ensure .env or config file is set (if needed)

### 🔗 Connect Contract & ABI
Open constants.js or config.js

Set your deployed contract address:
export const contractAddress = "0xYourContractAddress";
Set your ABI:

export const coffeeAbi = [/* ABI JSON */];
Example Contract Config in Code

const contractConfig = {
  address: "0xYourContractAddressHere",
  abi: CoffeeABI,
  chainId: 11155111 // Sepolia
};

### 📸 Screenshots
🔌 Wallet Disconnected : 

✅ Wallet Connected : 

☕ ETH Donation UI : 



### 📋 To-Do / Future Features
 Basic ETH donation

 Add donor name/message support

 Display recent donors

 Improve UI responsiveness

 Multi-network support (Mainnet, Goerli)

 Accept ERC-20 tokens

 Add withdrawal history for owner

 Smart contract audit

📜 License & Author
License: MIT
Author: @bkoushik11 — Solidity contract & frontend logic

Feel free to fork, remix, and improve. Happy BUIDLing! ☕✨

markdown
