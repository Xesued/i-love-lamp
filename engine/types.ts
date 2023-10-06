export type RGB = [number, number, number];
export type RGBW = [number, number, number, number];

export type ColorGeneratorOptions = {
    // The number of milliseconds between ticks
    tickMs: number;
    // How many LEDs are configured in the engine
    numOfLeds: number;
}

export type LedMap = {[index:number]:  RGBW} 
export type ColorGeneratorFunc = (opts: ColorGeneratorOptions) => Generator<LedMap>