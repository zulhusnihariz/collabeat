import { useEffect, useState } from 'react'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { goerli, polygonMumbai } from 'wagmi/chains';
import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import MainLayout from 'layouts/MainLayout';
import './App.css'
// Hook
import { IpfsProvider } from 'hooks/use-ipfs';
import { AlertMessageProvider } from 'hooks/use-alert-message';
import { rainbowWeb3AuthConnector } from 'hooks/rainbow-web3auth-connector';
// Router
import {
  Route,
  Routes,
} from "react-router-dom";

import PageIndex from 'pages';
import PageEditor from 'pages/editor';
import PageNft from 'pages/nft';
import PageInventory from 'pages/inventory';
import { ApiProvider } from 'hooks/use-api';


const App = () => {
  return (
    <Web3Wrapper>
      <ApiProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<PageIndex />} />
            <Route path="/nft" element={<PageNft />} />
            <Route path="/editor/:nftKey/:tokenId" element={<PageEditor />} />
            <Route path="/inventory" element={<PageInventory />} />
          </Routes>
        </MainLayout>
      </ApiProvider>
    </Web3Wrapper>
  )
}

const currentChain = [];
switch (import.meta.env.VITE_CHAIN_ID) {
  case '80001':
    currentChain.push(polygonMumbai);
    break;
  case 'goerli':
  default:
    currentChain.push(goerli);
}

// Web3 Configs
const { chains, publicClient } = configureChains(currentChain, [
  infuraProvider({ apiKey: String(import.meta.env.VITE_INFURA_ID) }),
  jsonRpcProvider({
    rpc: chain => {
      return {
        http: `${chain.rpcUrls.default}`,
      };
    },
  }),
  publicProvider(),
]);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      rainbowWeb3AuthConnector({ chains }),
      metaMaskWallet({
        chains,
        projectId: '',
      }),
    ],
  },
]);

const wagmiConfig = createConfig({ autoConnect: true, connectors, publicClient });

export function Web3Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={{
          appName: import.meta.env.APPNAME,
          learnMoreUrl: import.meta.env.APPURL,
        }}
        chains={chains}
        initialChain={polygonMumbai} // Optional, initialChain={1}, initialChain={chain.mainnet}, initialChain={gnosisChain}
        showRecentTransactions={true}
        theme={lightTheme()}
      >
        <IpfsProvider>
          <AlertMessageProvider>{children}</AlertMessageProvider>
        </IpfsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App
