"use client";

import { Button } from "@/components/ui/button";
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules"; 

export function Profile() {
    const { ready, login, logout, authenticated, user, getEthereumProvider } = usePrivy();
    const {wallets} = useWallets();
    const [wallet, setWallet] = useState<ConnectedWallet | undefined>(undefined);
    const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

    const bundler: IBundler = new Bundler({
        bundlerUrl: process.env.NEXT_PUBLIC_BUNDLER_URL!,    
        chainId: ChainId.BASE_GOERLI_TESTNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    })
    
    const paymaster: IPaymaster = new BiconomyPaymaster({
        paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!
    })

    const connect = async () => {
        try {
            const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
            if (!embeddedWallet) {
                throw new Error('Privy wallet not found');
            }
            setWallet(embeddedWallet);

            const customProvider = new ethers.providers.Web3Provider(await embeddedWallet.getEthereumProvider());
            setProvider(customProvider)

            // set privy wallet as signer
            const module = await ECDSAOwnershipValidationModule.create({
                signer: customProvider.getSigner(),
                moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
            })

            let biconomySmartAccount = await BiconomySmartAccountV2.create({
                chainId: ChainId.BASE_MAINNET,
                bundler: bundler, 
                paymaster: paymaster,
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                defaultValidationModule: module,
                activeValidationModule: module
            })
            setAddress( await biconomySmartAccount.getAccountAddress())
            setSmartAccount(biconomySmartAccount)
            console.log("biconomySmartAccount", biconomySmartAccount)
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    // call connect if ready and authenticated and user
    useEffect(() => {
        if (ready && authenticated && user) {
            connect();
        }
    }, [ready, authenticated, user]);
  
    return (
      <>
        <Head>
          <title>Login · Privy</title>
        </Head>
        {
          !authenticated ?
            <Button onClick={login}>Login</Button>
            : <Button onClick={logout}>Logout</Button>
        }
        {
            wallet && 
                <div>
                    Privy wallet Address: {wallet.address}
                </div>
        }
        {
            smartAccount && 
                <div>
                    Biconomy Smart Account Address: {address}
                </div>
        }
      </>
    );
  
  }