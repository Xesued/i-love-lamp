import { expect, test } from 'vitest'
import { blink } from '../blink';

test('ticking works', () => {
    const genFun = blink({ 
        leds: [0], 
        onColor: [100, 100, 100, 100], 
        offColor: [0, 0, 0, 0], 
        onDurationMs: 1000, 
        offDurationMs: 1000, 
        transitionMs: 100 
    })
    const gen = genFun({numOfLeds: 2, tickMs: 10});
   
    // We have 100ms to go from 0 - 100
    // for 10ms per tick, we should need 10 ticks,
    // thus value needs to change by 10 each tick...
    const { value } = gen.next()
    expect(value[0]).toStrictEqual([10,10,10,10]);
})

test('ticking too high is bound correct', () => {
    const genFun = blink({ 
        leds: [0], 
        onColor: [100, 100, 100, 100], 
        offColor: [0, 0, 0, 0], 
        onDurationMs: 1000, 
        offDurationMs: 1000, 
        transitionMs: 1 
    })
    const gen = genFun({numOfLeds: 2, tickMs: 10});
   
    const { value } = gen.next()
    expect(value[0]).toStrictEqual([100,100,100,100]);
})

test('ticking works with complex colors', () => {
    const genFun = blink({ 
        leds: [0], 
        onColor: [100, 0, 100, 0], 
        offColor: [0, 100, 0, 100], 
        onDurationMs: 1000, 
        offDurationMs: 1000, 
        transitionMs: 100 
    })
    const gen = genFun({numOfLeds: 2, tickMs: 10});
   
    const { value } = gen.next()
    expect(value[0]).toStrictEqual([10,90,10,90]);
})

test('ticking will switch directions', () => {
    const genFun = blink({ 
        leds: [0], 
        onColor: [100, 0, 0, 0], 
        offColor: Object.freeze([0, 0, 0, 0]), 
        onDurationMs: 100, 
        offDurationMs: 100, 
        transitionMs: 1 
    })

    // Three ticks to move from one to next.
    const gen = genFun({numOfLeds: 1, tickMs: 50});
   
    gen.next() // Should be 50
    gen.next() // Should set to ON, 100
    gen.next() // Should be ON, 100
    gen.next() // Should be Transition off 

    expect(gen.next().value[0]).toStrictEqual([50, 0,0,0]);
})
