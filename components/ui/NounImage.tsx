import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import seedrandom from 'seedrandom'

const DEFAULT_NOUN = {
  background: 1,
  body: 28, // slimegreen
  accessory: 24, // carrot
  head: 169, // rabbit head
  glasses: 20, // yellow
}

const NounImage = ({
  isLogo = false,
  prompt = 'happiness',
  size = 75,
  nounImageSeed = DEFAULT_NOUN
}) => {
  const {
    palette,
    // images
  } = ImageData // Used with `buildSVG``

  // const { bodies, accessories, heads, glasses } = images;
  // console.log(bodies.length, accessories.length, heads.length, glasses.length)

  const { parts, background } = getNounData(isLogo ? DEFAULT_NOUN : nounImageSeed)

  const svgBinary = buildSVG(parts, palette, background)
  const svgBase64 = btoa(svgBinary)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;base64,${svgBase64}`}
      alt={`${prompt} noun`}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  )
}

export { NounImage }

export const generateNounImageSeed = (prompt: string) => {
  // 30 bodies
  // 142 accessories
  // 250 heads
  // 23 glasses
  // 2 backgrounds

  const rng = seedrandom(prompt)

  return {
    background: Math.floor(rng() * 2),
    body: Math.floor(rng() * 30),
    accessory: Math.floor(rng() * 142),
    head: 169, // rabbit head
    glasses: Math.floor(rng() * 23),
  }
}

export const getNounBackgroundColor = (nounImageSeed = DEFAULT_NOUN) => {
  const { background } = getNounData(nounImageSeed)
  return `#${background}`
}