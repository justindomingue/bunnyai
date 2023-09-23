import { buildSVG } from '@nouns/sdk';
import { ImageData, getNounData } from '@nouns/assets';
import { Avatar } from './avatar';
import Image from 'next/image';
import seedrandom from 'seedrandom';

const Nounicon = ({ prompt = 'happiness' }) => {
    const { palette,
        // images
    } = ImageData; // Used with `buildSVG``

    // const { bodies, accessories, heads, glasses } = images;
    // console.log(bodies.length, accessories.length, heads.length, glasses.length)

    // 30 bodies 
    // 142 accessories
    // 250 heads
    // 23 glasses
    // 2 backgrounds

    const rng = seedrandom(prompt);

    const seed = {
        background: Math.floor(rng() * 2),
        body: Math.floor(rng() * 30),
        accessory: Math.floor(rng() * 142),
        head: Math.floor(rng() * 250),
        glasses: Math.floor(rng() * 23),
    }

    const { parts, background } = getNounData(seed);

    const svgBinary = buildSVG(parts, palette, background);
    const svgBase64 = btoa(svgBinary);

    return (
        <Avatar>
            <Image src={`data:image/svg+xml;base64,${svgBase64}`} alt={`${prompt} nounicon`} width={40} height={40} />
        </Avatar>
    )
}

export { Nounicon }