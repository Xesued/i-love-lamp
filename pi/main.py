import utime
import network
import usocket as socket
from micropython import const
from commander import Commander
from config import WIFI_SSID, WIFI_PASSWORD, LED_COUNT, UDP_PORT, GPIO_PIN, LED_SIZE, COMMAND_SIZE

RED = const((255, 0, 0,0))
WHITE = const((0, 0, 0,100))

def connectToWifi():
    """ Connect to the local network
    returns the connection
    """ 
    try: 
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)

        # Power managment, don't shut down wifi
        wlan.config(pm = 16)
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
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

def color_ip(commander):
    """
    Show the devices IP by encoding it in the LEDs
    TODO: Make this a oct with 8 colors vs binary. 
    """ 
    ip_bits = bin(int(ip.split('.')[-1]))
    ip_leds = [to_color(i) for i in ip_bits]

    for id, il in enumerate(ip_leds):
        commander.led_strip[id] = il
    commander.led_strip.write()

wlan = connectToWifi()
ip = wlan.ifconfig()[0]
mac = network.WLAN().config('mac')

print('MAC', mac, len(mac), list(mac))

s = getSocket(ip, UDP_PORT)
s.settimeout(2)

ip_bits = bin(int(ip.split('.')[-1]))
ip_leds = [to_color(i) for i in ip_bits]

commander = Commander(LED_COUNT, GPIO_PIN, list(mac))

# deref for performance
ticks_us = utime.ticks_us
parse = commander.parse
recv = s.recvfrom
sendto = s.sendto

# There are a few commands like to send that are not pixel commands.
# 1. Ping - Want to see if the device is still connected.  Also used
# for discoverability.  Returns the number of LEDs connected.
# 2. Leds - Light up the LEDs


# TODO:  Figure out bluetooth as well for configuring the device
# with wifi settings.

while True:
    try: 
        data, addr = recv(LED_COUNT * LED_SIZE + 3)
        res = parse(data)
        sendto(res, addr)

    except OSError as e:
        p=1 # No noop

    except Exception as e:
        print("Failed to execute command", type(e), e)
    

