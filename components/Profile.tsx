"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
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
    const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

    const bundler: IBundler = new Bundler({
        bundlerUrl: "",    
        chainId: ChainId.BASE_GOERLI_TESTNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    })
    
    const paymaster: IPaymaster = new BiconomyPaymaster({
        paymasterUrl: ""
    })

    const connect = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(getEthereumProvider(), "any")
            setProvider(provider)

            const module = await ECDSAOwnershipValidationModule.create({
            signer: provider.getSigner(),
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
            })

            let biconomySmartAccount = await BiconomySmartAccountV2.create({
                chainId: ChainId.POLYGON_MUMBAI,
                bundler: bundler, 
                paymaster: paymaster,
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                defaultValidationModule: module,
                activeValidationModule: module
            })
            setAddress( await biconomySmartAccount.getAccountAddress())
            setSmartAccount(biconomySmartAccount)
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    // call connect if ready and authenticated
    useEffect(() => {
        if (ready && authenticated) {
            connect();
        }
    }, [ready, authenticated]);
  
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
      </>
    );
  
  }