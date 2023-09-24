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
import { ethers } from 'ethers'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export let smartAccount: BiconomySmartAccountV2 | null = null

export function Profile() {
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

  const sendUserOp = async () => {
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
      1
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
      setLoading(false)
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
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>
      {!authenticated ? (
        <Button onClick={login}>Login</Button>
      ) : (
        <Button onClick={logout}>Logout</Button>
      )}
      {wallet && <div>Privy wallet Address: {wallet.address}</div>}
      {smartAccount && <div>Biconomy Smart Account Address: {address}</div>}
      <Button onClick={sendUserOp}>Send user op</Button>
    </>
  )
}
