import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Balance() {
  // Get the current wallet address from the dapp‑kit hook
  const account = useCurrentAccount();
  const zkloginaddress = account?.address; // Address generated for the signed‑in user

  const [coins, setCoins] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rpcurl = "https://fullnode.testnet.sui.io:443";

  useEffect(() => {
    // Only fetch when we have a valid address
    if (!zkloginaddress || typeof zkloginaddress !== "string") return;

    // Build JSON-RPC request to get all coins for this address
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "suix_getAllCoins",
      params: [zkloginaddress],
    };

    console.log("RPC Request:", JSON.stringify(body));

    fetch(rpcurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // Display RPC errors
          setError(`${data.error.code}: ${data.error.message}`);
          return;
        }

        const coinData = data.result?.data || [];
        setCoins(coinData);

        // Sum raw balances in MIST and convert to SUI
        const sumRaw = coinData.reduce(
          (sum, coin) => sum + BigInt(coin.balance),
          BigInt(0)
        );
        setTotalBalance(Number(sumRaw) / 1e9);
      })
      .catch((err) => {
        console.error("Error in displaying balance");
        setError(err.message);
      });
  }, [zkloginaddress]);

  return (
    <div>
      <h2>Wallet Balance</h2>
      {error && <p>Error: {error}</p>}
      {totalBalance !== null && (
        <div>
          <p>Total SUI Balance: {totalBalance} SUI</p>
        </div>
      )}
    </div>
  );
}
