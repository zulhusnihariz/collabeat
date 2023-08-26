import ChainName from "components/ChainName"
import MusicCard from "components/MusicCard"
import ShareDialog from "components/ShareDialog"
import { PlayerState, Sheet } from "lib"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { createMixedAudio, formatDataKey } from "utils"
import AddMusicIcon from 'assets/icons/addmusic.svg'
import VersionModal from "components/Modal/VersionModal"
import { Metadata } from "lib"
import { useApi } from "hooks/use-api"

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {rpc} = useApi()

  const { nft } = location.state || {}

  const [sheets, setSheets] = useState<Sheet[]>([])
  const [nftKey, setNftKey] = useState('')
  const [chainId, setChainId] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  // versions
  const [data, setData] = useState<String[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    const loadVersion = async () => {
      const response = await rpc.getMetadataByBlock(
        nft.chain as String, 
        nft.token_address as String, 
        nft.token_id as String, 
        import.meta.env.VITE_META_CONTRACT_ID as String
      )

      const metadatas = response.data.result.metadatas as Metadata[]

      const uniqueVersions: String[] = [];
      metadatas.map(item => {
          if (!uniqueVersions.includes(item.version)) {
              uniqueVersions.push(item.version);
          }
      });

      setIsDataLoaded(true)
      setData(uniqueVersions)
    }

    if(!nft) {
      navigate('/inventory')
    }

    if(nft && !isDataLoaded && !nftKey) {
      loadVersion()
    }
    
  }, [nft, navigate, isDataLoaded, nftKey, rpc])

  const [shareDialogState, setShareDialogState] = useState({
    dataKey: '',
    opened: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // init
  useEffect(() => {

    const init = () => {
      const key = formatDataKey(nft.chain_id, nft.address, nft.token_id)
      setNftKey(key)
      setChainId(nft.chain_id)
      setTokenAddress(nft.address)
      setTokenId(nft.token_id)
    }
    
    if(nft && !nftKey) {
      init()
    }
    
  }, [nft, nftKey])

  const [audioContext, setAudioContext] = useState(new AudioContext());
  const [audioPlayerState, setAudioPlayerState] = useState<{ [key: string]: PlayerState }>({});
  const [mixedAudio, setMixedAudio] = useState<{ [key: string]: AudioBuffer } | null>({});

  const updatePlayerState = (dataKey: string, state: PlayerState) => {
    setAudioPlayerState(prev => ({
      ...prev,
      [dataKey]: state,
    }));
  };

  const playerButtonHandler = async (dataKey: string) => {
    const isFirstPlay = audioPlayerState[dataKey] === undefined;

    if (isFirstPlay) {
      updatePlayerState(dataKey, PlayerState.LOADING);

      const mixed = await createMixedAudio(audioContext, dataKey);

      updatePlayerState(dataKey, PlayerState.PLAY);

      setMixedAudio(prev => ({
        ...prev,
        [dataKey]: mixed,
      }));
      return;
    }

    switch (audioPlayerState[dataKey]) {
      case PlayerState.STOP:
        updatePlayerState(dataKey, PlayerState.PLAY);
        break
      case PlayerState.PLAY:
        updatePlayerState(dataKey, PlayerState.PAUSED);
        break;
      case PlayerState.PAUSED:
        updatePlayerState(dataKey, PlayerState.PLAY);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {nft && <div className="flex justify-center">
      <div className="block w-3/4">
        <div className="bg-[#181818] rounded p-4">
          <div className="flex">
            <div className="flex-auto w-1/4">
              <img src={nft.metadata.image} className="rounded-lg bg-white w-full h-full"/>
            </div>
            <div className="flex-auto w-3/4 px-5">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{nft.metadata.name}</span>
              </div>
              <div>
                <div className="flex justify-between text-gray-400 text-sm my-2">
                  <div className="">Address: {nft.address} <span className="mx-3">&#8226;</span> #{nft.token_id} <span className="mx-3">&#8226;</span> <ChainName chainId="56" /></div>
                </div>
                <p className="">
                  {nft.metadata.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-[#181818] rounded p-4">
          <div className="text-2xl font-semibold mb-4">Released Audios</div>
          <div className="font-xs text-gray-400">You have have not release any audios yet</div>
        </div>
        
        <div className="mt-5 bg-[#181818] rounded p-4">
          <div className="text-2xl font-semibold mb-4">Unreleased Audios</div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
            <button 
              className="bg-red-900 rounded-lg px-4 py-2 text-white w-full flex items-center justify-center cursor-pointer hover:border hover:border-white"
              onClick={() => openModal()}>
              <div className="block">
                <img src={AddMusicIcon} className="mx-auto" />
                <div className="text-sm mt-1">New Audio</div>
              </div>
            </button>
              {sheets.map((sheet, index) => (
                <MusicCard
                  sheet={sheet}
                  key={index}
                  version={sheet.version}
                  name={sheet.data_key.toString()}
                  description={''}
                  audioUrls={[]}
                  onHandleShareClicked={dataKey =>
                    setShareDialogState({
                      dataKey,
                      opened: true,
                    })}
                  onHandlePlayClicked={playerButtonHandler}
                  updatePlayerState={updatePlayerState}
                  audioState={audioPlayerState}
                  mixedAudio={mixedAudio ? mixedAudio[sheet.data_key.toString()] : undefined}
                />
              ))}
          </div>
        </div>

        {shareDialogState.opened && (
          <ShareDialog
            dataKey={shareDialogState.dataKey}
            onHandleCloseClicked={() =>
              setShareDialogState({
                dataKey: '',
                opened: false,
              })
            }
          />
        )}
      </div>
    </div>}
    <VersionModal chainId={chainId} tokenAddress={tokenAddress} tokenId={tokenId} isOpen={isModalOpen} onClose={closeModal} version="89c337cb-0206-414e-a379-a78158538aec" />
    </>
  )
}

export default PageNft