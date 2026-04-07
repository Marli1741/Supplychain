# Web3 Pharmaceutical Supply Chain (Hybrid DApp)

A decentralised application (DApp) that tracks the lifecycle of products from raw materials to final sale. 

This project goes beyond a standard blockchain ledger by integrating **Hybrid Hardware Geolocation**, pulling live device GPS coordinates into the Ethereum blockchain to bridge the gap between physical logistics and digital state machines.

## Core Features 

### 1. Core Blockchain Logic & Security
* **Strict Role-Based Access Control (RBAC):** Cryptographically enforces supply chain roles. The smart contract actively checks the MetaMask wallet address and blocks execution if the user isn't officially registered by the Admin for that specific job (e.g., a Manufacturer cannot execute a Distributor's function).
* **Chronological State Machine:** Built a rigid tracking pipeline (`Admin -> RMS -> Manufacture -> Distribute -> Retail -> Sold`). Transactions attempting to skip steps or execute out of order are automatically reverted by the Smart Contract.

### 2. Hybrid Hardware Integration
* **Live Device Geolocation:** Integrates with physical hardware (`navigator.geolocation`) to pull real-world Latitude and Longitude coordinates during supply chain handoffs.
* **Dynamic Live Mapping:** The tracking page reads on-chain coordinates and dynamically generates a clickable link that drops a pin directly onto Google Maps.

### 3. Gas-Optimized Frontend Engineering
* **Off-Chain Data Parsing:** Engineered the React frontend to map numerical stages (`0`, `1`, `2`) to readable strings natively in the browser, preventing the blockchain from wasting expensive computation fees (gas) on string translation.
* **Strict TypeScript/Web3 Bridging:** Successfully bridged dynamic, unpredictable Web3 data into a strict TypeScript environment using type casting.
* **Data Sanitization:** Implemented strict type-checking and `Number()` wrappers on all transaction inputs to prevent Web3 "String vs. Integer" transaction crashes.


## Tech Stack

* **Smart Contracts:** Solidity, Hardhat, Ethers.js
* **Frontend:** Next.js (React), Web3.js, Tailwind CSS, TypeScript
* **Blockchain Network:** Localhost (Ganache / Hardhat Node)
* **Wallet Integration:** MetaMask

## How to Run the Project Locally

### 1. Start the Local Blockchain
Open a terminal in the `backend` folder and start the Hardhat node:
npm run node

### 2. Deploy the Smart Contract
Open a *second* terminal in the `backend` folder and deploy the contract to the local network:
npx hardhat run scripts/deploy.ts --network localhost

### 3. Launch the Frontend
Open a *third* terminal in the `client` folder and start the Next.js development server:
npm run dev -- --webpack
*(Navigate to `http://localhost:3000` in your browser.)*

## Testing the Supply Chain

1. Connect MetaMask to **Account 0** (The Admin).
2. Go to **Register Roles** and authorize Accounts 1 through 4.
3. Go to **Order Materials** to initialize a new product (Generates ID 1).
4. Switch through Accounts 1-4 on the **Supply Operations** page to move the product down the assembly line. *(Note: Allow location permissions when prompted to record GPS data!)*
5. Go to **Track Materials**, enter ID 1, and view the verified blockchain history and live Google Maps link.
