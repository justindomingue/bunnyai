'use client'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Button } from '@/components/ui/button'
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
import { NounImage } from './ui/NounImage'

export let smartAccount: BiconomySmartAccountV2 | null = null

export function OnboardingLogin({}: {}) {
  const { ready, login, logout, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | undefined>(undefined)
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
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

  // when authenticated, push new screen
  useEffect(() => {
    if (authenticated) {
      // push new screen
    }
  }, [authenticated])

  const onPressCreateBunny = () => {
    login()
  }

  const connect = async () => {
    try {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy'
      )
      if (!embeddedWallet) {
        throw new Error('Privy wallet not found')
      }
      setWallet(embeddedWallet)

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
      setAddress(await smartAccount.getAccountAddress())
      console.log('smartAccount', smartAccount)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      className={`justify-between flex flex-col gap-8 absolute inset-0 p-8 transition-all duration-300`}
    >
      {/* header */}
      <div className="flex flex-row justify-between">
        <NounImage isLogo />
      </div>

      {/* body */}
      <div className="flex flex-col gap-5">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-5xl">
          welcome to BunnyAI
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-2xl ">🫵 you are about to</p>
          <p className="text-2xl ">🚀 dive into rabbit holes</p>
          <p className="text-2xl ">🤯 that will blow your mind</p>
        </div>
      </div>

      <div className="flex flex-row  gap-2">
        <Button
          className="w-full"
          variant="default"
          onClick={onPressCreateBunny}
        >
          create bunny
        </Button>
      </div>
    </div>
  )
}
