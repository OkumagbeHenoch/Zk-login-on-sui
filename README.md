# zk-Login

*Forked from [Blockchain Bard repo](https://github.com/blockchainBard101/zk-login-port-haecourt-soc-workshop)*

A demo of a zero-knowledge login flow with Enoki and the Sui blockchain, built with the Mysten Labs Typescript SDK. This project also includes a test transfer feature to verify Enoki ZK-enabled transactions.

## Prerequisites


* A Google OAuth Client ID
* Enoki API keys:

  * **Client-side:** Enoki public key
  * **Server-side / Backend:** Enoki private key

## Installation

1. Clone the repo and cd into it:

   ```bash
   git clone https://github.com/OkumagbeHenoch/Zk-login-on-sui.git
   cd Zk-login-on-sui
   ```
2. Install dependencies:

   ```bash
   npm install react react-dom @mysten/enoki @mysten/dapp-kit @mysten/sui @tanstack/react-query
   ```

## Configuration

Create a `.env` file in the root directory with:

```dotenv
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ENOKI_PUBLIC_KEY=your-enoki-public-key
VITE_ENOKI_PRIVATE_KEY=your-enoki-private-key
VITE_APP_SUI_FULLNODE_URL=https://fullnode.testnet.sui.io:443
VITE_APP_NETWORK=testnet   # or devnet. Mainnet support requires funded account.
```

Ensure your Google OAuth credentials authorize `http://localhost:5173 & http://localhost:5173/login` for redirect URI.

## Running Locally

```bash
npm run dev  # starts Vite server on http://localhost:5173
```

## Useful Links

* [Enoki TS SDK Documentation](https://docs.enoki.mystenlabs.com/ts-sdk)
* [Sui by Examples (TypeScript Intro)](https://suibyexamples.wal.app/ts-intro)
* [Sui SDK (Mysten Labs)](https://sdk.mystenlabs.com/)
* [Sui API Reference](https://docs.sui.io/sui-api-ref)
* [Enoki Portal](https://portal.enoki.mystenlabs.com)
* [Sui Faucet](https://faucet.sui.io)
*[Enoki ZK Login Tutorial Video]
(https://youtu.be/gU1WOSF3jkU?si=OWmo9MpupSB7faRa)
## License

MIT
