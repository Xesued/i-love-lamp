import machine
from micropython import const

WIFI_SSID = 'myssid'
WIFI_PASSWORD = 'mypassword'
PORT = 50222
LED_COUNT = const(60)
FPS = const(16)
GPIO_PIN = machine.Pin.board.GP0