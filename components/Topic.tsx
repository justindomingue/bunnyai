'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { darken } from 'polished'

import { Noun } from "@/components/Noun"
import { Button } from "@/components/ui/button"
import { createContext, useCallback, useContext, useState } from "react"
import { Nounicon } from './ui/nounicon'

const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    //   swipeToSlide: true,
};

const TopicContext = createContext<{
    label: string
    activeLevel: number
    contentList: Array<string>
    onDeeper: (newLevel: number) => void
    onTurn: () => void
}>({
    label: 'This is the topic',
    activeLevel: 0,
    contentList: [],
    onDeeper: () => { },
    onTurn: () => { },
})

export function Topic({ label, onTurn }: { label: string, onTurn: () => void }) {
    const [contentList, setContentList] = useState([])
    const [activeLevel, setActiveLevel] = useState(0)

    const onDeeper = useCallback((newLevel: number) => setActiveLevel(newLevel), [])

    return <TopicContext.Provider value={{ label, activeLevel, contentList, onDeeper, onTurn }}>
        <Slider {...carouselSettings} className='h-full' afterChange={(level) => { setActiveLevel(level) }}>
            <Section level={1} />
            <Section level={2} />
            <Section level={3} />
        </Slider>

        <div className="justify-between flex flex-col gap-6 absolute inset-0 p-8 h-fit">
            {/* header */}
            <div className="flex flex-row justify-between">
                <Nounicon prompt={label} />
                <Button>420 $honk</Button>
            </div>

            {/* topic */}
            <div className="flex flex-col gap-1">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{label}</h1>
                <p className="text-md text-muted-foreground">Level {activeLevel}</p>
            </div>
        </div>

    </TopicContext.Provider >
}

function Section({ level }: { level: number }) {
    const { contentList, activeLevel } = useContext(TopicContext)
    const backgroundColor = darken(level * 0.05, '#FFCD64')

    return (
        <div className='flex flex-col gap-4 px-8 h-screen w-screen' style={{ backgroundColor }}>
            <div className="flex flex-col gap-4 font-bold mt-44">
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>
                <p className="text-lg">This is the body text about the rabbit hole.</p>

            </div>

            {/* actions */}
            <div className="flex flex-row justify-between">
                <Button>deeper</Button>
                <Button>turn</Button>
            </div>
        </div>
    )
}