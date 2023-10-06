import { Server } from "socket.io"
import express from "express"
import { createServer } from 'node:http'
import udp from 'dgram'

import { ColorEngine } from 'engine';
import { blink } from 'engine/animations/blink'
import { solid } from 'engine/animations/solid'
import * as colors from 'engine/colors'
import type { RGBW } from 'engine/types'


const LED_COUNT = 60;
const LED_PORT = 50222;
const LED_IP = '192.168.12.199';

const client = udp.createSocket('udp4');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log("Client connected")
    socket.on("color-change", (colorInfo) => {
        sendColors(colorInfo)
        console.log('color change:', colorInfo)
    })
})


httpServer.listen(3000, '192.168.12.209', () => {
    console.log('Server listenting on 3000')
})


const engine = new ColorEngine(LED_COUNT);
// engine.addAnimation(blink({
//     leds: Array.from(Array(LED_COUNT).keys()), //.filter(i => i <= 30),
//     offDurationMs: 100,
//     offColor: [...colors.MAGENTA, 100],
//     // onColor: [...colors.TEAL, 0],
//     onColor:[255, 255,25,255],
//     onDurationMs: 2000,
//     transitionMs: 1000
// }));

engine.addAnimation(blink({
    leds: Array.from(Array(LED_COUNT).keys()), //.filter(i => i <= 30),
    offDurationMs: 5000,
    offColor: [...colors.TEAL, 0],
    // onColor: [...colors.TEAL, 0],
    onColor:[...colors.AMBER, 0],
    onDurationMs: 5000,
    transitionMs: 1
}));

// engine.addAnimation(blink({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > 30),
//     offDurationMs: 10,
//     offColor: [...colors.AMBER, 0],
//     onColor: [...colors.JADE, 0],
//     onDurationMs: 10,
//     transitionMs: 2000,
// }));



// engine.addAnimation(solid({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > LED_COUNT / 2),
//     updateLeds: itvl(50),
//     color: [...colors.RED, 0],
// }))
// engine.addAnimation(solid({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > LED_COUNT / 2),
//     updateLeds: itvl(40),
//     color: [...colors.GREEN, 0],
// }))
// engine.addAnimation(solid({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > LED_COUNT / 2),
//     updateLeds: itvl(30),
//     color: [...colors.BLUE, 0],
// }))
// engine.addAnimation(solid({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > LED_COUNT / 2),
//     updateLeds: itvl(20),
//     color: [...colors.PINK, 0],
// }))
// engine.addAnimation(solid({
//     leds: Array.from(Array(LED_COUNT).keys()).filter(i => i > LED_COUNT / 2),
//     updateLeds: itvl(10),
//     color: [...colors.JADE, 0],
// }))


async function run() {
    engine.run(sendColors);
}


function sendColors(leds: RGBW[]) {
    var buff = Buffer.alloc(LED_COUNT * 4);
    leds.forEach((led, i) => {
        buff.set([led[0], led[1], led[2], led[3]], i * 4)
    });

    client.send(buff, LED_PORT, LED_IP, (error) => {
        if (error) client.close();
    })
}

run()


function itvl(delay: number) {
    let upDown = 1
    let solidLed = 0
    let solidLeds: number[] = []
    setInterval(() => {
        if (upDown === 1) {
            if (solidLed + 1 > LED_COUNT) {
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
        solidLeds = [Math.max(solidLed - 1, 0), solidLed, Math.min(solidLed + 1, LED_COUNT - 1)]
        // solidLeds = Array.from(Array(solidLed).keys())
    }, delay);

    return () => solidLeds
}