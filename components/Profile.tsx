'use client'

import { Button } from '@/components/ui/button'
import {
  BUNNY_TOKEN_ABI,
  BUNNY_TOKEN_DEPLOYER,
  BUNNY_TOKEN_ON,
} from '@/lib/constants'
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
import {
  BiconomyPaymaster,
  IHybridPaymaster,
  IPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { CredentialType, IDKitWidget } from '@worldcoin/idkit'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { NounImage } from './ui/NounImage'

let smartAccount: BiconomySmartAccountV2 | null = null

export function Profile() {
  const { logout, user } = usePrivy()
  const { wallets } = useWallets()
  const [wallet, setWallet] = useState<ConnectedWallet | undefined>(undefined)
  const [address, setAddress] = useState<string>('')
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  )
  const [showDevInfo, setShowDevInfo] = useState<boolean>(false)

  const bundler: IBundler = new Bundler({
    bundlerUrl: process.env.NEXT_PUBLIC_BUNDLER_URL!,
    chainId: ChainId.BASE_MAINNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
  })

  const sendUserOp = async () => {
    console.log('[debug] sendUserOp', smartAccount, provider)
    if (!smartAccount || !provider) {
      throw new Error('Provider not found')
    }
    const contractAddress = BUNNY_TOKEN_ON(ChainId.BASE_MAINNET)
    const contract = new ethers.Contract(
      contractAddress,
      BUNNY_TOKEN_ABI,
      provider
    )
    const txn = await contract.populateTransaction.transfer(
      BUNNY_TOKEN_DEPLOYER,
      ethers.utils.parseEther('1')
    )
    console.log(txn.data)
    const userOp = await smartAccount.buildUserOp([
      {
        to: contractAddress,
        data: txn.data,
      },
    ])
    console.log(userOp)
    const biconomyPaymaster =
      smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>
    let paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0',
      },
    }
    const paymasterAndDataResponse =
      await biconomyPaymaster.getPaymasterAndData(userOp, paymasterServiceData)

    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
    const userOpResponse = await smartAccount.sendUserOp(userOp)
    console.log('userOpHash', userOpResponse)
    const { receipt } = await userOpResponse.wait(1)
    console.log('txHash', receipt.transactionHash)
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
    } catch (error) {
      console.error(error)
    }
  }

  // call connect if ready and authenticated and user
  useEffect(() => {
    if (user) {
      connect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div
      className={`flex flex-col absolute inset-0 bg-slate-700 transition-all duration-300`}
    >
      {/* header */}
      <div className="flex flex-col gap-5 bg-fuchsia-500 px-6 pt-8 pb-6">
        <div className="flex flex-row gap-3">
          <NounImage prompt={wallet?.address} />
          <div className="flex flex-col">
            <p className="text-3xl text-white">Explorer Bunny</p>
            <p className="text-lg text-white text-opacity-50">
              {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            className="w-1/2 bg-green-400"
            variant="cta"
            onClick={() => {}}
          >
            get $honk
          </Button>
          <Button
            className="w-1/2 bg-slate-500"
            variant="cta2"
            onClick={() => {}}
          >
            420 $honk
          </Button>
        </div>
      </div>
      {/* body */}
      <div className="flex flex-col gap-4 px-4 overflow-auto pt-6 pb-14">
        <div className="flex flex-col px-8 py-4 rounded-[30px] gap-3 bg-slate-50 bg-opacity-50">
          <h3 className="text-2xl text-white">claim 10 free $honk</h3>
          <Button
            className="bg-yellow-300 hover:bg-yellow-400 text-black"
            onClick={() => {
              // TODO: ADD CLAIM 10 $HONK!!!
            }}
          >
            claim 10 $honk
          </Button>
        </div>

        <div className="flex flex-col only:px-8 py-4 rounded-[30px] gap-3 bg-slate-50 bg-opacity-50 px-4">
          <h3 className="text-2xl text-white">
            verify with WorldID for 100 bonus free $honk
          </h3>
          <IDKitWidget
            app_id={process.env.WORLDCOIN_APP_ID!} // obtained from the Developer Portal
            action="claim-dollarhonk-0" // this is your action name from the Developer Portal
            onSuccess={() => {
              // TODO:
              console.log('USER HAS ORB SCANNED! GIVE THEM FREE $honk!!')
            }} // callback when the modal is closed
            handleVerify={() => {
              console.log('verifying user with worldID..')
            }} // optional callback when the proof is received
            credential_types={[CredentialType.Orb]} // optional, defaults to ['orb']
            enableTelemetry // optional, defaults to false
          >
            {({ open }) => (
              <Button onClick={open}>verify with WorldID™️</Button>
            )}
          </IDKitWidget>
        </div>

        <div className="flex flex-col px-8 py-4 rounded-[30px] gap-3 bg-slate-50 bg-opacity-50">
          <h3 className="text-2xl text-white">buy $honk on uniswap (base)</h3>
          <Button
            onClick={() => {
              // copy to clipboard
              navigator.clipboard
                .writeText('0x981c5b436121c75cf043a622d078988248ef203d')
                .then(() => {
                  console.log('Text copied to clipboard')
                })
                .catch((error) => {
                  console.error('Failed to copy text to clipboard:', error)
                })
            }}
          >
            <p className="text-sm">
              0x981c5b436121c75cf043a622d078988248ef203d
            </p>
          </Button>
        </div>

        <div className="flex flex-col px-6 gap-3">
          <Button onClick={logout}>Logout</Button>
          <Button
            onClick={() => {
              window.open(`https://basescan.org/address/${wallet?.address}`)
            }}
          >
            View on BaseScan
          </Button>
          <Button
            onClick={() => {
              setShowDevInfo(!showDevInfo)
            }}
          >
            Show/hide dev info
          </Button>
          {showDevInfo && wallet && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-white">
                Privy wallet Address: {wallet.address}
              </p>
              <p className="text-lg text-white">
                Biconomy Smart Account Address: {address}
              </p>
              <Button onClick={sendUserOp}>Send test user op</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
