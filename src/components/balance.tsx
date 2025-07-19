import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Balance() {
  const account = useCurrentAccount();
  const zkloginaddress = account?.address;

  const [coins, setCoins] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rpcurl = "https://fullnode.testnet.sui.io:443";

  useEffect(() => {
    if (!zkloginaddress) return;

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
          setError(`${data.error.code}: ${data.error.message}`);
          return;
        }

        const coinData = data.result?.data || [];
        setCoins(coinData);

        const sumRaw = coinData.reduce(
          (sum: bigint, coin: any) => sum + BigInt(coin.balance),
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
    <div>
      <h2>Account Balance</h2>
      {error && <p>Error: {error}</p>}
      {totalBalance !== null && (
        <div>
          <p>Total SUI Balance: {totalBalance} SUI</p>
        </div>
      )}
    </div>
  );
}
