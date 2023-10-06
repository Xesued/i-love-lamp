I Love Lamp
=====================

A pet project for creating a programmable LED strip of 60 LEDs in a vertial lamp.

Raspberry Pi Picos are used to controll the light strips.  They are a thin client
that receives a stream of led color values.  This project includes a Node server
that is the lighting engine, and communicates with the Picos.  It can also accept
commands from a Web client.

## Demo Video

// Soon.

## Arcitecture

```mermaid
flowchart TD;
    id1("Web Client");
    id2("Server");
    id3("Microcontroller");
    id1-- Sends IP of lamp and color command -->id2;
    id2-- Runs command, calculates colors, sends to correct microcontroller -->id3;
```
