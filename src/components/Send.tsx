import { useEffect, useState, useCallback } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

const TransferSUI = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const zkloginaddress = account?.address;

  const [userBalance, setUserBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [txnDigest, setTxnDigest] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCoins, setUserCoins] = useState<any[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");

  const { mutate: signTransaction } = useSignTransaction();

  const getBalance = useCallback(
    async (walletAddress: string) => {
      if (!walletAddress || !client) {
        setUserBalance(0);
        setUserCoins([]);
        setSelectedCoinId("");
        console.warn("Cannot fetch balance: Wallet address or SuiClient not available.");
        return;
      }

      try {
        const coinsResponse = await client.getCoins({
          owner: walletAddress,
          coinType: "0x2::sui::SUI",
        });

        setUserCoins(coinsResponse.data);

        const totalSUIBalance = coinsResponse.data.reduce(
          (acc, coin) => acc + BigInt(coin.balance),
          BigInt(0)
        );
        setUserBalance(Number(totalSUIBalance) / 1e9);

        if (coinsResponse.data.length > 0) {
          const exists = coinsResponse.data.some(c => c.coinObjectId === selectedCoinId);
          if (!exists) {
            setSelectedCoinId(coinsResponse.data[0].coinObjectId);
          }
        } else {
          setSelectedCoinId("");
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
        setUserBalance(0);
        setUserCoins([]);
        setSelectedCoinId("");
      }
    },
    [client, selectedCoinId]
  );

  const transferSUI = async () => {
    if (!account || !client) {
      alert("Wallet not connected or SuiClient not initialized. Please connect your wallet.");
      setLoading(false);
      return;
    }
    if (!recipientAddress) {
      alert("Please enter a recipient address.");
      setLoading(false);
      return;
    }
    if (!selectedCoinId) {
      alert("Please select a SUI coin to send from.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const tx = new Transaction();
      tx.setSender(account.address);
      console.log("Transaction sender set to:", account.address);

      const selectedCoin = userCoins.find(coin => coin.coinObjectId === selectedCoinId);
      tx.setGasPayment([
        {
          objectId: selectedCoin.coinObjectId,
          version: selectedCoin.version,
          digest: selectedCoin.digest,
        },
      ]);
      console.log("Gas payment set with coin:", selectedCoin.coinObjectId);

      const amountInMIST = 0.1 * 10 ** 9;
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMIST)]);
      tx.transferObjects([coin], tx.pure.address(recipientAddress));
      console.log("Transaction commands added: Split and Transfer.");

      console.log("Building transaction bytes...");
      const transactionBlockBytes = await tx.build({ client });
      console.log("Transaction bytes built successfully.");

      signTransaction(
        { transaction: tx, account: account },
        {
          onSuccess: async signedTx => {
            console.log("Transaction signed:", signedTx);
            try {
              console.log("Executing signed transaction...");
              const txnRes = await client.executeTransactionBlock({
                signature: signedTx.signature,
                transactionBlock: signedTx.bytes,
                options: {
                  showEffects: true,
                  showEvents: true,
                },
              });
              console.log("Transaction Execution Response:", txnRes);

              if (txnRes?.digest && txnRes.effects?.status.status === "success") {
                setTxnDigest(txnRes.digest);
                alert(`Transfer Success. Digest: ${txnRes.digest}`);
                getBalance(zkloginaddress || "");
              } else {
                console.error("Transaction failed or had non-success status:", txnRes);
                alert("Transaction failed. Check console for details.");
              }
            } catch (execError) {
              console.error("Error executing signed transaction:", execError);
              alert("Error executing signed transaction. Check console for details.");
            } finally {
              setLoading(false);
            }
          },
          onError: err => {
            console.error("Error signing transaction:", err);
            alert("Error signing transaction. Check console for details.");
            setLoading(false);
          },
        }
      );
    } catch (err) {
      console.error("Unexpected error preparing or building transaction:", err);
      alert("Unexpected error preparing or building transaction. Check console for details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zkloginaddress && client) {
      getBalance(zkloginaddress);
    } else {
      setUserBalance(0);
      setUserCoins([]);
      setSelectedCoinId("");
    }
  }, [zkloginaddress, client, getBalance]);

  return (
    <div>
      <h3>Transfer SUI (Testnet)</h3>
      <p>
        Note: Please ensure your wallet on Testnet has sufficient SUI to cover the transfer and gas fees.
      </p>
      <div>
        <h4>Send SUI</h4>
        <input
          name="recipientAddress"
          value={recipientAddress}
          placeholder="Recipient Address (0x...)"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRecipientAddress(e.target.value)
          }
        />
        <button
          onClick={transferSUI}
          disabled={loading || !account || !client || !selectedCoinId || !recipientAddress}
        >
          Transfer 0.2 SUI
        </button>
        {loading && <div>Transferring...</div>}
      </div>
    </div>
  );
};

export default TransferSUI;
