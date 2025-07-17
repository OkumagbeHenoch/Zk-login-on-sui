import React, { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Balance() {
  // Grab the current wallet address (string) from the dapp-kit hook
  const account = useCurrentAccount();
  const zkloginaddress = account?.address;

  const [coins, setCoins] = useState([]);
  const [totalBalance, setTotalBalance] = useState(null);
  const [error, setError] = useState(null);

  const url = "https://fullnode.testnet.sui.io:443";

  useEffect(() => {
    // Only attempt fetch when we have a valid string address
    if (!zkloginaddress || typeof zkloginaddress !== "string") return;

    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "suix_getAllCoins",
      params: [zkloginaddress],
    };

    // Debug: log the exact JSON payload
    console.log("RPC Request:", JSON.stringify(body));

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // Show RPC errors
          setError(`${data.error.code}: ${data.error.message}`);
          return;
        }

        const coinData = data.result?.data || [];
        setCoins(coinData);

        // Sum raw balances and convert to SUI
        const sumRaw = coinData.reduce(
          (sum, coin) => sum + BigInt(coin.balance),
          BigInt(0)
        );
        setTotalBalance(Number(sumRaw) / 1e9);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, [zkloginaddress]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Account Balance</h2>

     
        <div>
          <p className="mb-4">Total SUI Balance: {totalBalance} SUI</p>
        </div>
    </div>
  );
}
