import { Dialog } from '@headlessui/react'
import { useBoundStore } from 'store'
import ConnectSolana from 'components/Connect/ConnectSolana'
import ConnectWallet from 'components/Connect/ConnectWallet'
import ConnectNear from 'components/Connect/ConnectNear'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import { arbitrum, bsc, celo, mainnet, polygon } from 'wagmi/chains'
import { useState } from 'react'
import {
  EthereumIcon,
  ArbitrumIcon,
  BscIcon,
  CeloIcon,
  NearIcon,
  PolygonIcon,
  SolanaIcon,
} from 'components/Icons/network'

const chains = [
  {
    name: 'Ethereum',
    chain: mainnet,
    svg: <EthereumIcon />,
  },
  {
    name: 'Polygon',
    chain: polygon,
    svg: <PolygonIcon />,
  },
  {
    name: 'BNB Smart Chain',
    chain: bsc,
    svg: <BscIcon />,
  },
  {
    name: 'Arbitrum',
    chain: arbitrum,
    svg: <ArbitrumIcon />,
  },
  {
    name: 'Celo',
    chain: celo,
    svg: <CeloIcon />,
  },
  {
    name: 'Solana',
    chain: null,
    svg: <SolanaIcon />,
  },
  {
    name: 'Near',
    chain: null,
    svg: <NearIcon />,
  },
]

export default function SignInModal() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { modal, setModalState } = useBoundStore()
  return (
    <>
      <Dialog open={modal.signUpMain.isOpen} onClose={() => setModalState({ signUpMain: { isOpen: false } })}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed left-1/2 w-[90%] md:w-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-slate-500 bg-[#0D0D0D] text-white">
          <Dialog.Panel>
            <div className="md:w-full grid grid-cols-4">
              <div className="hidden md:block">
                <img
                  alt="Trainer"
                  src="https://images.unsplash.com/photo-1611510338559-2f463335092c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"
                  className="h-32 w-full object-cover md:h-full"
                />
              </div>
              <div className="col-span-full md:col-span-3 flex md:flex-col md:gap-5 md:space-x-1 rounded-xl bg-blue-900">
                <div className="bg-blue-800 p-3">
                  <nav className="flex flex-col md:flex-row gap-1" aria-label="Tabs">
                    {chains.map((chain, index) => {
                      const isSelected = index === selectedIndex
                      return (
                        <a
                          href="#"
                          key={index}
                          className={
                            isSelected
                              ? 'shrink-0 rounded-lg bg-green-600 p-2 text-sm font-medium text-green-100'
                              : 'shrink-0 rounded-lg p-2 text-sm font-medium text-gray-300 hover:bg-green-300 hover:text-gray-700'
                          }
                          onClick={e => {
                            e.preventDefault() // Prevents the default link behavior
                            setSelectedIndex(index)
                          }}
                        >
                          <div className="flex items-center">
                            {chain.svg}
                            {chain.name}
                          </div>
                        </a>
                      )
                    })}
                  </nav>
                </div>
                <div className="flex bg-blue-900 w-full justify-start items-center md:block md:mt-3">
                  <div className={chains[selectedIndex].name == 'Ethereum' ? '' : 'hidden'}>
                    <ConnectWallet chain={CURRENT_CHAIN.ETHEREUM} chainId={chains[selectedIndex].chain?.id as number} />
                  </div>
                  <div className={chains[selectedIndex].name == 'Polygon' ? '' : 'hidden'}>
                    <ConnectWallet chain={CURRENT_CHAIN.POLYGON} chainId={chains[selectedIndex].chain?.id as number} />
                  </div>
                  <div className={chains[selectedIndex].name == 'BNB Smart Chain' ? '' : 'hidden'}>
                    <ConnectWallet chain={CURRENT_CHAIN.BINANCE} chainId={chains[selectedIndex].chain?.id as number} />
                  </div>
                  <div className={chains[selectedIndex].name == 'Arbitrum' ? '' : 'hidden'}>
                    <ConnectWallet chain={CURRENT_CHAIN.ARBITRUM} chainId={chains[selectedIndex].chain?.id as number} />
                  </div>
                  <div className={chains[selectedIndex].name == 'Celo' ? '' : 'hidden'}>
                    <ConnectWallet chain={CURRENT_CHAIN.CELO} chainId={chains[selectedIndex].chain?.id as number} />
                  </div>
                  <div className={chains[selectedIndex].name == 'Solana' ? '' : 'hidden'}>
                    <ConnectSolana />
                  </div>
                  <div className={chains[selectedIndex].name == 'Near' ? '' : 'hidden'}>
                    <ConnectNear />
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
