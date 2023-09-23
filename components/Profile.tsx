"use client";

import { Button } from "@/components/ui/button";
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import {
    IPaymaster,
    BiconomyPaymaster,
    IHybridPaymaster,
    SponsorUserOperationDto,
    PaymasterMode,
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";

export let smartAccount: BiconomySmartAccountV2 | null = null;

export function Profile() {
    const { ready, login, logout, authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const [wallet, setWallet] = useState<ConnectedWallet | undefined>(undefined);
    const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

    const bundler: IBundler = new Bundler({
        bundlerUrl: process.env.NEXT_PUBLIC_BUNDLER_URL!,
        chainId: ChainId.BASE_GOERLI_TESTNET,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    })

    const paymaster: IPaymaster = new BiconomyPaymaster({
        paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!
    })

    const sendUserOp = async () => {
        if (!smartAccount || !provider) {
            throw new Error("Provider not found")
        }
        const contractAddress = "0xB850aD09eC3816588Ca66C5ADf13D053cf0C9C56";
        const contractABI = [
            {
                "inputs": [],
                "name": "increment",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "number",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "newNumber",
                        "type": "uint256"
                    }
                ],
                "name": "setNumber",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const txn = await contract.populateTransaction.setNumber(1);
        console.log(txn.data);
        const userOp = await smartAccount.buildUserOp([{
            to: contractAddress,
            data: txn.data
        }]);
        console.log(userOp);
        const biconomyPaymaster =
            smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
        let paymasterServiceData: SponsorUserOperationDto = {
            mode: PaymasterMode.SPONSORED,
            smartAccountInfo: {
                name: 'BICONOMY',
                version: '2.0.0'
            },
            calculateGasLimits: true
        };
        const paymasterAndDataResponse =
            await biconomyPaymaster.getPaymasterAndData(
                userOp,
                paymasterServiceData
            );

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
        const userOpResponse = await smartAccount.sendUserOp(userOp);
        console.log("userOpHash", userOpResponse);
        const { receipt } = await userOpResponse.wait(1);
        console.log("txHash", receipt.transactionHash);
    }

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
            const biconomyModule = await ECDSAOwnershipValidationModule.create({
                signer: customProvider.getSigner(),
                moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
            })

            smartAccount = await BiconomySmartAccountV2.create({
                chainId: ChainId.BASE_GOERLI_TESTNET,
                bundler: bundler,
                paymaster: paymaster,
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                defaultValidationModule: biconomyModule,
                activeValidationModule: biconomyModule
            })
            setAddress(await smartAccount.getAccountAddress())
            console.log("smartAccount", smartAccount)
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    // call connect if ready and authenticated and user
    useEffect(() => {
        if (user) {
            connect();
        }
    }, [user]);

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
            <Button onClick={sendUserOp} >Send user op</Button>
        </>
    );

}