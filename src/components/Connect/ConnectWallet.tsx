import { useAccount } from 'wagmi';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useBoundStore } from 'store';
import { CURRENT_CHAIN } from 'store/slices/wallet.slice';
import { useEffect } from 'react';
import { useConnect } from 'wagmi'
interface WalletProp {
  chain: CURRENT_CHAIN,
  chainId: number
}

const RenderChain = (prop: {chain: CURRENT_CHAIN}) => {
  switch(prop.chain) {
    case CURRENT_CHAIN.ETHEREUM:
      return 'Ethereum'
    case CURRENT_CHAIN.POLYGON:
      return 'Polygon'
    case CURRENT_CHAIN.BINANCE:
      return 'Binance'
  }
}

export default function ConnectWallet(prop: WalletProp) {
  const { setCurrentWalletState, setWalletState, setModalState } = useBoundStore();
  const { isConnected, isDisconnected, address } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setModalState({ signUpMain: { isOpen: false } });
      setCurrentWalletState({ chain: prop.chain });
      setWalletState({ evm: { address, publicKey: address } });
    }
    if (isDisconnected) setCurrentWalletState({ chain: undefined });
  }, [isConnected]);
  
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: prop.chainId
  })
  
  return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="rounded-xl bg-[#3898FF] px-[14px] py-2 font-bold"
        >
          <RenderChain chain={prop.chain} />
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
    </>
  );
}
