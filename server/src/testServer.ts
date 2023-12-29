import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"
import udp from "dgram"

import { ColorEngine } from "engine"
import { blink } from "engine/animations/blink"
import { solid } from "engine/animations/solid"
import { rainbow } from "engine/animations/rainbow"
import * as colors from "engine/colors"
import { AnimationType, type RGBW } from "engine/types"

const LED_COUNT = 60
const LED_PORT = 50222
const LED_IP = "192.168.12.206"

const client = udp.createSocket("udp4")

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {})

httpServer.listen(3000, "192.168.12.209", () => {
  console.log("Server listenting on 3000")
})

client.addListener("message", (msg) => {
  if (msg.length < 2) {
    console.log("Error, expected larger message", msg)
    return
  }
  // console.log("msg id", msg.readUInt16BE(0))
  // console.log("Num of leds", msg.readUInt16BE(2))
  // const macBytes = Array.from(msg)
  //   .slice(4)
  //   .map((byte) => {
  //     return ("0" + (byte & 0xff).toString(16)).slice(-2)
  //   })
  //   .join(":")
  // console.log("mac addess", macBytes)
})

setInterval(() => {
  sendPing()
}, 5000)

function getRandomColor(): RGBW {
  let c1 = randomNum(0, 255)
  let c2 = randomNum(0, 255)
  let c3 = randomNum(0, 255)
  // let c4 = randomNum(0, 0)
  return [c1, c2, c3, 0]
}

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let ledColors: RGBW[] = []
for (let i = 0; i < LED_COUNT; i++) {
  ledColors.push(getRandomColor())
}

// setInterval(() => {
//   ledColors.shift()
//   ledColors.push(getRandomColor())
//   sendColors(ledColors)
// }, 24)

const engine = new ColorEngine(LED_COUNT)
engine.addAnimation("RAINBOW123", {
  type: AnimationType.RAINBOW,
  transitionMs: 100,
})
engine.setColorCollector(sendColors)

// engine.addAnimation(
//   blink({
//     leds: Array.from(Array(LED_COUNT).keys()), //.filter(i => i <= 30),
//     offDurationMs: 5000,
//     offColor: [...colors.TEAL, 0],
//     // onColor: [...colors.TEAL, 0],
//     onColor: [...colors.AMBER, 0],
//     onDurationMs: 5000,
//     transitionMs: 1,
//   })
// )

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
  engine.run()
}

/**
 * Returns a message id
 */
let id = 0
function getMessageId() {
  id = id + 1
  return id
}

const META_BYTES = 3 // 1 for command, 2 for id.
function sendPing() {
  var buff = Buffer.alloc(META_BYTES)
  buff.set([1], 0) // Ping Command
  buff.writeUInt16BE(getMessageId(), 1)
  client.send(buff, LED_PORT, LED_IP, (error) => {
    if (error) client.close()
  })
}

function sendColors(leds: RGBW[]) {
  var buff = Buffer.alloc(LED_COUNT * 4 + META_BYTES)
  buff.set([2], 0) // LED Command
  buff.writeUInt16BE(getMessageId(), 1)
  leds.forEach((led, i) => {
    buff.set([led[0], led[1], led[2], led[3]], i * 4 + META_BYTES)
  })

  client.send(buff, LED_PORT, LED_IP, (error) => {
    if (error) client.close()
  })
}

run()

// function itvl(delay: number) {
//   let upDown = 1
//   let solidLed = 0
//   let solidLeds: number[] = []
//   setInterval(() => {
//     if (upDown === 1) {
//       if (solidLed + 1 > LED_COUNT) {
//         // At the top... go back down
//         upDown = 0
//         solidLed--
//       } else {
//         solidLed++
//       }
//     } else {
//       if (solidLed - 1 < 0) {
//         // At the bottom... go back up
//         upDown = 1
//         solidLed++
//       } else {
//         solidLed--
//       }
//     }
//     solidLeds = [
//       Math.max(solidLed - 1, 0),
//       solidLed,
//       Math.min(solidLed + 1, LED_COUNT - 1),
//     ]
//     // solidLeds = Array.from(Array(solidLed).keys())
//   }, delay)

//   return () => solidLeds
// }
