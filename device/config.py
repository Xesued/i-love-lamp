import machine
from micropython import const

WIFI_SSID = 'myssid'
WIFI_PASSWORD = 'mypassword'
UDP_PORT = 50222
TCP_PORT = 50223
LED_COUNT = const(60)
FPS = const(16)
GPIO_PIN = machine.Pin.board.GP0
COMMAND_SIZE = const(1)
LED_SIZE = const(4)