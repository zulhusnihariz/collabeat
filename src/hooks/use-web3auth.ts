import { Web3Auth } from '@web3auth/modal';
import { useState } from 'react';

export function useWeb3Auth() {
	const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);

	async function initWeb3AuthModal(): Promise<Web3Auth> {
		const web3auth = new Web3Auth({
			clientId: 'YOUR_WEB3AUTH_CLIENT_ID', // Get your Client ID from Web3Auth Dashboard
			chainConfig: {
				chainNamespace: 'eip155',
				chainId: '0x1', // Please use 0x5 for Goerli Testnet
				rpcTarget: 'https://rpc.ankr.com/eth',
			},
		});

		await web3auth.initModal();
		setWeb3Auth(web3auth);

		return web3auth;
	}

	async function connectWeb3Auth(web3Auth: Web3Auth) {
		if (web3Auth) await web3Auth?.connect();
	}

	return { initWeb3AuthModal, connectWeb3Auth, web3Auth };
}
