'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Noun } from "@/components/Noun"
import { Button } from "@/components/ui/button"
import { createContext, useCallback, useContext, useState } from "react"

const carouselSettings = {
    dots: false,
    infinite: true,
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
    onDeeper: () => void
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

    const onDeeper = useCallback(() => setActiveLevel(activeLevel => activeLevel + 1), [])

    return <TopicContext.Provider value={{ label, activeLevel, contentList, onDeeper, onTurn }}>
        <div className="flex-1 justify-between flex flex-col gap-6 absolute h-screen w-screen inset-0 p-8">
            <div className='flex flex-col gap-4'>
                {/* header */}
                <div className="flex flex-row justify-between">
                    <Noun />
                    <Button>420 $honk</Button>
                </div>

                {/* topic */}
                <div className="flex flex-col gap-1">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{label}</h1>
                    <p className="text-md text-muted-foreground">Level {activeLevel}</p>
                </div>
            </div>

            {/* actions */}
            <div className="flex flex-row justify-between">
                <Button>deeper</Button>
                <Button>turn</Button>
            </div>
        </div>

        {/* <div className='absolute inset-0'>
            <Slider {...carouselSettings} className='h-full'>
                <Section offset={-1} />
                <Section offset={0} />
                <Section offset={1} />
            </Slider>
        </div> */}

    </TopicContext.Provider >
}

function Section({ offset }: { offset: number }) {
    const { contentList, activeLevel } = useContext(TopicContext)
    const content = contentList[activeLevel + offset]

    return <div className="flex flex-col gap-4 font-bold px-8 mt-44 h-screen">
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
        <p className="text-lg">This is the body text about the rabbit hole.</p>
    </div>
}