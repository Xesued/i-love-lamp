import utime
import network
import usocket as socket
from micropython import const
from commander import Commander

SSID = const('WIFI_SSID')
PASSWORD = const('WIFI_PASSWORD')

RED = const((255, 0, 0,0))
WHITE = const((0, 0, 0,100))

PORT = 50222
LED_COUNT = const(60)

def connectToWifi():
    """ Connect to the local network
    returns the connection
    """ 
    try: 
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)

        # Power managment, don't shut down wifi
        wlan.config(pm = 16)
        wlan.connect(SSID, PASSWORD)
        max_wait = 20
        
        status = wlan.status
        while max_wait > 0:
            if status() < 0 or status () >= 3:
                break;
            max_wait -= 1
            utime.sleep(1)
            
        if status() != 3:
            raise RuntimeError('Netowrk Connection has failed')
        else:
            print('connected')
        
        return wlan
    except Exception as error:
        print("Error", error)


def getSocket(ip, port):
    """ Attempts to build a UDP socket connection
    on the port provided.
    
    Returns the socket
    """    
    print(f'Connected on {ip}')
    addr_info = socket.getaddrinfo(ip, port)
    addr = addr_info[0][-1]

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind(addr)
    return s

def to_color(bv):
    if bv == '0':
        return RED
    return WHITE 

wlan = connectToWifi()
ip = wlan.ifconfig()[0]
s = getSocket(ip, PORT)
s.settimeout(2)

ip_bits = bin(int(ip.split('.')[-1]))
print('IP bits', ip_bits)

ip_leds = [to_color(i) for i in ip_bits]
print('IP leds', ip_leds)


commander = Commander(LED_COUNT, 0)

for id, il in enumerate(ip_leds):
    commander.led_strip[id] = il
commander.led_strip.write()

ticks_us = utime.ticks_us


while True:
    try:    
        data = s.recv(LED_COUNT * 4)
        start = ticks_us()
        commander.parse(data)

    except OSError as e:
        p=1 # No noop
    except Exception as e:
        print("Failed to execute command", type(e), e)
    # utime.sleep_ms(10)
    

