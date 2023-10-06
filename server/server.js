
const { Server } = require("socket.io")
const express = require('express')
const { createServer } = require('node:http')
const convert = require("color-convert")
const udp = require('dgram')

const LED_COUNT = 60;
const LED_PORT = 50222;
const LED_IP = '192.168.12.199';

const client = udp.createSocket('udp4');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,  {
    cors: {
        origin: "*"
    } 
});

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


function sendColors(colorRgb) {
    const led = convert.hex.rgb(colorRgb)
    console.log("Color", led)

    var buff = Buffer.alloc(LED_COUNT * 4 + 3);
    buff.set([1], 0); // Set strip command
    // buff.set([led[1], led[0], led[2], 0], 1); // RG are fliped
    buff.set([led[0], led[1], led[2], 0], 1); // RG are fliped
    buff.writeUint16BE(0, 5) // 1 sec duration

    let r1 = Math.floor(Math.random() * LED_COUNT)
    let r2 = Math.floor(Math.random() * LED_COUNT)

    // let start = Math.min(r1, r2)
    // let end = Math.max(r1, r2)
    
    buff.writeUint8(0, 7)
    buff.writeUint8(LED_COUNT -1, 8)

    if (!client.connecting){
    client.send(buff, LED_PORT, LED_IP, (error) => {
        if (error) client.close();
        else console.log('Sent color, ', led)
    })
}
}


