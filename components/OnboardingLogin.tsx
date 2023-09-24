'use client'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Button } from '@/components/ui/button'
import { BiconomySmartAccountV2 } from '@biconomy/account'
import { usePrivy } from '@privy-io/react-auth'
import { NounImage } from './ui/NounImage'

export let smartAccount: BiconomySmartAccountV2 | null = null

export function OnboardingLogin({}: {}) {
  const { login } = usePrivy()

  const onPressCreateBunny = () => {
    login()
  }

  return (
    <div
      className={`justify-between flex flex-col gap-8 absolute inset-0 p-8 transition-all duration-300`}
    >
      {/* header */}
      <div className="flex flex-row justify-between">
        <NounImage isLogo size={100} />
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
