"use client"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import { NounIcon } from "./ui/NounIcon"

export function Airdrop() {
  return (
    <div
      className={`justify-between flex flex-col gap-6 absolute inset-0 p-8 h-fit  transition-all duration-300`}
    >
      {/* header */}
      <div className="flex flex-row justify-between">
        <NounIcon prompt={"TODO_DEFAULT"} />
      </div>

      {/* topic */}
      <div className="flex flex-col gap-1">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          airdrop
        </h1>
        <p className="text-lg text-muted-foreground">
          get rewarded for $honk $honk.
        </p>
        <p className="text-lg text-muted-foreground">coming soon™️</p>
      </div>
    </div>
  )
}
