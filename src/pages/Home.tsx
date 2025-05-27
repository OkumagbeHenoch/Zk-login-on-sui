// import { useCurrentAccount } from '@mysten/dapp-kit';
// import { Link } from 'react-router-dom';
// import LogoutButton from '../components/Logout';
// export default function Home() {
// 	const currentAccount = useCurrentAccount();
// 	if (!currentAccount) {
// 		return (
// 			<div>
// 				<h1>You are not logged in.</h1>
// 				<Link to="/login">Go to Login</Link>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div>
// 			<h1>Welcome, {currentAccount.address}</h1>
// 			<p>This is your home page.</p>

//             <LogoutButton />
// 		</div>

// 	);
// }

import { useCurrentAccount} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/Logout';
import { SponsoredTxExecutor } from '../components/SponsorTx';

export default function Home() {
	const currentAccount = useCurrentAccount();

	if (!currentAccount) {
		return (
			<div>
				<h1>You are not logged in.</h1>
				<Link to="/login">Go to Login</Link>
			</div>
		);
	}

	// Build transaction
	const tx = new Transaction();
	tx.moveCall({
		target: '',
		arguments: [
		],
	});

	return (
		<div>
			<h1>Welcome, {currentAccount.address}</h1>
			<p>This is your home page.</p>

			{/* Sponsored Transaction Button */}
			<SponsoredTxExecutor tx={tx}/>

			<LogoutButton />
		</div>
	);
}

