import utime
import machine
from neopixel import NeoPixel as MicroNeo
from cu_neopixel import Neopixel as CustomNeo

LED_PIN = 0
POLL_AMOUNT = 1000
NUM_LEDS = 60
A_NUM_LEDS = 5

ticks_us = utime.ticks_us

i = 0 

colors = [
    (100, 0, 100, 0),
    (100, 0, 100, 100),
    (100, 0, 100, 23),
    (100, 100, 0, 0),
    (40, 0, 100, 0),
    (50, 0, 100, 0),
    (100, 0, 0, 0),
    (100, 100, 100, 0)
]
co = (233,0,0,0)



def run_micro_tests():
    print("Micropython verion:")
    p = machine.Pin.board.GP0;
    mpix = MicroNeo(p, NUM_LEDS, bpp=4)
    print("====== fill ======")
    start = utime.ticks_ms()
    i = 0
    while i < POLL_AMOUNT :
        color = colors[i % 8]
        mpix.fill(color)
        mpix.write()
        i = i + 1
    print('...done')
    t = utime.ticks_ms() - start
    print('Completed in ms:', t)
    print(' avg ms/write:', t / POLL_AMOUNT)
    
    print("====== get/set ======")
    start = utime.ticks_ms()
    i = 0
    while i < POLL_AMOUNT :
        ix = i % A_NUM_LEDS
        iz = ix - 1
        if iz < 0:
            iz = A_NUM_LEDS -1
        
        j = NUM_LEDS
        while j > 0:
            j = j - 1
            nc = mpix[j]
        nc = mpix[ix]			# random read
        mpix[iz] = (0, 0, 0 ,0) # Turn off
        mpix[ix] = co
        mpix.write()
        utime.sleep_ms(16)
        i = i + 1
    t = utime.ticks_ms() - start
    print('Completed in ms:', t)
    print(' avg ms/write:', t / POLL_AMOUNT)
    
def run_cust_tests():
    cpix = CustomNeo(NUM_LEDS, 0, 0, "RGBW")
    print("Custom verion:")
    start = utime.ticks_ms()
    i = 0
    print("====== fill ======")
    while i < POLL_AMOUNT :
        color = colors[i % 8]
        cpix.fill(color)
        cpix.show()
        i = i + 1
    print('...done')
    t = utime.ticks_ms() - start
    print('Completed in us:', t)
    print(' avg ms/show:', t /POLL_AMOUNT)


    print("====== set ======")
    start = utime.ticks_ms()
    i = 0
    while i < POLL_AMOUNT :
        ix = i % A_NUM_LEDS
        iz = ix - 1
        if iz < 0:
            iz = A_NUM_LEDS -1
        j = NUM_LEDS
        while j > 0:
            j = j - 1
            nc = cpix.get_pixel(j)
        cpix.set_pixel(iz, (0,0,0,0))
        cpix.set_pixel(ix, co)
        cpix.show()
        utime.sleep_ms(16)
        i = i + 1
    print('...done')
    t = utime.ticks_ms() - start
    print('Completed in us:', t)
    print(' avg ms/show:', t /POLL_AMOUNT)


run_micro_tests()
# run_cust_tests()