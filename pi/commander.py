import neopixel
import machine

from config import FPS, GPIO_PIN


class Commander:
    def __init__(self, num_of_leds, gpio_pin):
        """
        param: neo_strip Instance of Neopixel 
        """
        self.num_of_leds = num_of_leds
        self.led_strip = neopixel.NeoPixel(p, num_of_leds, bpp=4)

    def parse(self, command_bytes):
        """
        takes in a message and sees if we have a command registered for
        it.

        If we do, pass control over to that command 
        """
        
        l = len(command_bytes)
        p = 0
        s = self.led_strip
        
        while p < l:
            rgbw = (
                command_bytes[0 + p],
                command_bytes[1 + p],
                command_bytes[2 + p],
                command_bytes[3 + p],
            )
            
            s[p // 4] = rgbw
            p = p + 4
        
        self.led_strip.write()
