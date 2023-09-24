'use client'

import { Airdrop } from '@/components/Airdrop'
import { OnboardingLogin } from '@/components/OnboardingLogin'
import { Profile } from '@/components/Profile'
import { Topic } from '@/components/Topic'
import { NounImage } from '@/components/ui/NounImage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account'
import { Bundler, IBundler } from '@biconomy/bundler'
import { ChainId } from '@biconomy/core-types'
import {
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
  ECDSAOwnershipValidationModule,
} from '@biconomy/modules'
import { BiconomyPaymaster, IPaymaster } from '@biconomy/paymaster'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { AppContext } from './AppContext'

const topics: Record<string, Array<[string, string]>> = {
  Happiness: [
    [
      'Happiness',
      "Happiness is like a burst of sunshine in your soul, lifting you up and making you do a little happy dance. Did you know that the sound of a baby laughing can instantly make your heart skip with joy? That's right, a simple giggle can have you feeling like you've won the happiness jackpot! So let those laughter lines show, because happiness is contagious and can spread faster than a contagious dance craze. Find your happy place, whether it's hugging your pet, singing in the shower, or eating ice cream for breakfast (no judgment here), and let that pure bliss wash over you like a bubbly rainbow.",
    ],
    ['Psychology', 'Somethingsomething'],
  ],

  'Roman Empire': [
    [
      'Roman Empire',
      'The Roman Empire was an ancient civilization that lasted for over 500 years, from 27 BCE to 476 CE. It started as a small city-state in Italy and grew to become one of the largest and most influential empires in history, spanning across three continents. Romans were known for their advanced engineering, impressive military, and significant contributions to art, literature, and law, shaping the foundations of Western civilization.',
    ],
    ['Roman engineering', 'somethingsomething'],
  ],

  Stonehenge: [
    [
      'Stonehenge',
      "Stonehenge, where rocks gather for an epic game of musical chairs. An ancient puzzle left behind by giants, waiting for the right hands to solve it. The original selfie spot that even prehistoric influencers couldn't resist.",
    ],
    [
      'Stonehenge',
      "Stonehenge was actually built by a secret civilization of alien pandas who wanted to create a bamboozling tourist attraction on Earth. Archaeologists believe that Stonehenge was not made by humans, but by time-traveling wizards who needed a place to practice their magic spells without being spotted by Muggles. The real secret behind Stonehenge? It's a giant cosmic jukebox that plays the world's catchiest tunes, and ancient civilizations built it to keep the party going non-stop.",
    ],
  ],
}

export let smartAccount: BiconomySmartAccountV2 | null = null

export default function Home() {
  const [topic, setTopic] = useState(Object.keys(topics)[0])
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [connectedWallet, setConnectedWallet] =
    useState<ConnectedWallet | null>()
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  )

  const bundler: IBundler = new Bundler({
    bundlerUrl: process.env.NEXT_PUBLIC_BUNDLER_URL!,
    chainId: ChainId.BASE_MAINNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
  })

  const connect = async () => {
    console.log('[debug] connect wallets', wallets)
    try {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy'
      )
      if (!embeddedWallet) {
        throw new Error('[debug] Privy wallet not found')
      }
      console.log(
        '[debug] Connected to Privy embedded wallet ',
        embeddedWallet.address
      )

      setConnectedWallet(embeddedWallet)

      const customProvider = new ethers.providers.Web3Provider(
        await embeddedWallet.getEthereumProvider()
      )
      setProvider(customProvider)

      // set privy wallet as signer
      const biconomyModule = await ECDSAOwnershipValidationModule.create({
        signer: customProvider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      })

      smartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.BASE_MAINNET,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: biconomyModule,
        activeValidationModule: biconomyModule,
      })
      const biconomySmartAddress = await smartAccount.getAccountAddress()
      console.log('Connected to biconomySmartAddress ', biconomySmartAddress)
    } catch (error) {
      console.error(error)
    }
  }

  // call connect if ready and authenticated and user to get biconomy smart account from privy signer
  useEffect(() => {
    console.log('[debug] ready auth user ', ready, authenticated, user)

    async function connectAsync() {
      if (ready && authenticated && user) {
        connect()
      }
    }
    connectAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, user])

  if (!ready) {
    return (
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-5">
        <div className="flex flex-row justify-between">
          <NounImage size={100} />
        </div>

        {/* body */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            loading...
          </h1>
          <p className="text-lg ">$honk $honk</p>
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
        <OnboardingLogin />
      </main>
    )
  }

  return (
    <AppContext.Provider value={{ provider, smartAccount, connectedWallet }}>
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
        <Tabs defaultValue="feed" className="flex flex-col flex-1 gap-8">
          <TabsContent value="feed" className="flex-1">
            <Topic
              topic={topics[topic]}
              onTurn={() =>
                setTopic(
                  Object.keys(topics)[
                    Object.keys(topics).findIndex((t) => t === topic) + 1
                  ]
                )
              }
            />
          </TabsContent>
          <TabsContent value="profile">
            <Profile />
          </TabsContent>
          <TabsContent value="airdrop">
            <Airdrop />
          </TabsContent>
          <TabsList className="absolute bottom-8">
            <TabsTrigger value="feed">for you</TabsTrigger>
            <TabsTrigger value="profile">profile </TabsTrigger>
            <TabsTrigger value="airdrop">airdrop</TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
      ={' '}
    </AppContext.Provider>
  )
}
