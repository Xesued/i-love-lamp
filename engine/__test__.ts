
import { ColorEngine } from ".";
import { blink } from '../web/app/src/animations/blink'; 

const engine = new ColorEngine(60);
engine.addAnimation(blink({
    duration: -1, // -1 = loop forever
    timeOn: 1000,
    timeOff: 4000,
    color: [244,0,0],
}))