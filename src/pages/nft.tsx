import ChainName from "components/ChainName"
import MusicCard from "components/MusicCard"
import ShareDialog from "components/ShareDialog"
import { PlayerState, Sheet } from "lib"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createMixedAudio } from "utils"
import AddMusicIcon from 'assets/icons/addmusic.svg'

const data = {
  "title": "BoredApeYachtClub #1221",
  "image": "https://ipfs.io/ipfs/QmTLj3bQ9HxAJY7CrGqwxVaAzMgghdDy4JKBaue8d5spHy",
  "description": "One of the most popular mobile games ever! Are you sending \"sus\" memes in the discord channel all day? You should try the imposter clips as well to troll your friends. Check all the sound clips in the Among Us soundboard below."
}

const beats = {
  "data": [
    {
        "owner": "0xba21df4cf0e779f46cadd58ccf5a24ce2512d09e",
        "token_id": 8,
        "data_key": "0c2437d898045ee74fb3f0e732e1e2a1edc73b761f8168d466b43a3507fc17c2",
        "cid": "1",
    },
    {
        "owner": "0xc20de1a30487ec70fc730866f297f2e2f1e411f7",
        "token_id": 195,
        "data_key": "8896b35ed4f501e6582923f650d7f659817da5cf19a4ef88cb1ea7fd79b81ba3",
        "cid": "2"
    },
    {
      "owner": "0xc20de1a30487ec70fc730866f297f2e2f1e411f7",
      "token_id": 195,
      "data_key": "8896b35ed4f501e6582923f650d7f659817da5cf19a4ef88cb1ea7fd79b81ba3",
      "cid": "2"
    },
    {
      "owner": "0xc20de1a30487ec70fc730866f297f2e2f1e411f7",
      "token_id": 195,
      "data_key": "8896b35ed4f501e6582923f650d7f659817da5cf19a4ef88cb1ea7fd79b81ba3",
      "cid": "2"
    },
    {
      "owner": "0xc20de1a30487ec70fc730866f297f2e2f1e411f7",
      "token_id": 195,
      "data_key": "8896b35ed4f501e6582923f650d7f659817da5cf19a4ef88cb1ea7fd79b81ba3",
      "cid": "2"
    }
  ]
}

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { nft } = location.state || {}

  useEffect(() => {
    if(!nft) {
      navigate('/inventory')
    }
  }, [nft, navigate])

  const [shareDialogState, setShareDialogState] = useState({
    dataKey: '',
    opened: false,
  });

  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    setSheets(beats.data)
  }, [setSheets])

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
          <div className="text-2xl font-semibold mb-4">NFT Beats</div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
            <div className="bg-red-900 rounded-lg px-4 py-2 text-white w-full flex items-center justify-center cursor-pointer hover:border hover:border-white">
              <div className="block">
                <img src={AddMusicIcon} className="mx-auto" />
                <div className="text-sm mt-1">New Beat</div>
              </div>
            </div>
          {sheets.map((sheet, index) => (
            <MusicCard
              sheet={sheet}
              key={index}
              tokenId={sheet.token_id.toString()}
              name={sheet.data_key.toString()}
              description={''}
              audioUrls={[]}
              onHandleShareClicked={dataKey =>
                setShareDialogState({
                  dataKey,
                  opened: true,
                })
              }
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
    </>
  )
}

export default PageNft