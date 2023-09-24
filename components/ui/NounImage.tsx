import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import seedrandom from 'seedrandom'

const NounImage = ({ isLogo = false, prompt = 'happiness', size = 60 }) => {
  const {
    palette,
    // images
  } = ImageData // Used with `buildSVG``

  // const { bodies, accessories, heads, glasses } = images;
  // console.log(bodies.length, accessories.length, heads.length, glasses.length)

  // 30 bodies
  // 142 accessories
  // 250 heads
  // 23 glasses
  // 2 backgrounds

  const rng = seedrandom(prompt)

  const seed = isLogo
    ? {
      background: 1,
      body: 28, // slimegreen
      accessory: 24, // carrot
      head: 169, // rabbit head
      glasses: 20, // yellow
    }
    : {
      background: Math.floor(rng() * 2),
      body: Math.floor(rng() * 30),
      accessory: Math.floor(rng() * 142),
      head: 169, // rabbit head
      glasses: Math.floor(rng() * 23),
    }

  const { parts, background } = getNounData(seed)

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
