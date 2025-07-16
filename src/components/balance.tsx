import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { jwtToAddress } from '@mysten/sui/zklogin';

const zkLoginUserAddress = jwtToAddress(jwtAsString, salt);

 
// use getFullnodeUrl to define the Testnet RPC location
const rpcUrl = getFullnodeUrl('testnet');
 
// create a client connected to testnet
const client = new SuiClient({ url: rpcUrl });
 
async function getOwnedCoins() {
    const coins = await client.getCoins({
        owner:zkLoginUserAddress ,
    });
    console.log(coins.data);
}
 
export default getOwnedCoins;