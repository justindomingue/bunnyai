"use client"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import { Button } from "@/components/ui/button"
import { NounIcon } from "./ui/NounIcon"

export function OnboardingLogin({}: {}) {
  const onPressCreateBunny = () => {
    // TODO: trigger privy flow? maybe on a new screen?
  }

  return (
    <div
      className={`justify-between flex flex-col gap-8 absolute inset-0 p-8 h-fit transition-all duration-300`}
    >
      {/* header */}
      <div className="flex flex-row justify-between">
        <NounIcon prompt={"TODO_DEFAULT"} />
      </div>

      {/* body */}
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          welcome to bunnyAI
        </h1>
        <p className="text-2xl ">🫵 you are about to</p>
        <p className="text-2xl ">🚀 dive into rabbit holes</p>
        <p className="text-2xl ">🤯 that will blow your mind</p>
      </div>

      <div className="flex flex-row  gap-2">
        <Button className="w-full" variant="default" onClick={() => {}}>
          create bunny
        </Button>
      </div>
    </div>
  )
}
