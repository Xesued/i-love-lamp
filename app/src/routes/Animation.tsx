import { useState, useEffect, useRef } from 'react';
import { Input } from "@nextui-org/react";
import convert from "color-convert";

import { ColorEngine } from 'engine';
import { blink } from 'engine/animations/blink';
import { solid } from 'engine/animations/solid';
import { RGBW } from 'engine/types';
import * as colors from 'engine/colors';


function ledToRGB(led: RGBW) {
    return `#${convert.rgb.hex(led[0], led[1], led[2])}`
}

export default function Animation() {
    const [numOfPixels, setNumOfPixels] = useState(6)
    const [numOfSolidPixels, setNumOfSolidPixels] = useState(3)
    const [leds, setLeds] = useState<RGBW[]>([])

    const solidAnimation = useRef()

    useEffect(() => {
        const empty = Array(numOfPixels).fill(colors.RED);
        const newLeds = [...leds
            .concat(empty)
            .slice(0, numOfPixels),
        ]
        setLeds(newLeds);

        const engine = new ColorEngine(numOfPixels);
        engine.addAnimation(blink({
            leds: Array.from(Array(numOfPixels).keys()),
            offDurationMs: 1000,
            offColor: [0,0,0,0],
            onColor:[255,0,0,0],
            onDurationMs:1000,
            transitionMs: 200
        }));

        let upDown = 1
        let solidLed = 0 
        let solidLeds:number[] = []
        const intv = setInterval(() => {
            if(upDown === 1) {
               if (solidLed + 1 > numOfPixels) {
                // At the top... go back down
                upDown = 0;
                solidLed--
               } else {
                solidLed++
               }
            } else {
               if (solidLed - 1 < 0) {
                // At the bottom... go back up 
                upDown = 1;
                solidLed++;
               } else {
                solidLed--
               }
            }
            solidLeds = Array.from(Array(solidLed).keys())
        }, 100);

        engine.addAnimation(solid({
            leds: Array.from(Array(numOfPixels).keys()).filter(i => i > numOfPixels / 2),
            updateLeds: () => solidLeds,
            color: [...colors.TEAL, 0],
        }))

        engine.run(setLeds)

        return () => {
            console.log('STOPING ENGINE')
            engine.stop()
            clearInterval(intv)
        }
        
    }, [numOfPixels])


    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 bg-danger-900">
                <Input onChange={(e) => setNumOfPixels(parseInt(e.currentTarget.value, 10))} />
            </div>
            <div className="flex gap-2 bg-danger-900">
                <Input onChange={(e) => setNumOfSolidPixels(parseInt(e.currentTarget.value, 10))} />
            </div>
            <div>
                leds {leds.length}
                <div className="flex flex-wrap gap-1">
                {leds.map(led => {
                    return <div className="w-5 h-5 border-1" style={{ backgroundColor: ledToRGB(led) }} />
                })}
                </div>
            </div>
        </div>
    )
}