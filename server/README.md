# Lamp Server

MongoDB + Fastify Node server to manage lamps and the
animations running on them

There are two primary methods to push colors to a lamp.

1. HTTP requests to toggle animations
2. Websocket connections to push colors directly to lamps

### HTTP Requests

```
# Get a device guid
GET /devices

# Get the animation guid
GET /animations

# Toggle an animation on a device
POST /devices/:deviceGuid/animation/:animationGuid
```

### Websocket

Once a connection is established, you can send binary data in the following format:

| Bytes              | Description                                         |
| ------------------ | --------------------------------------------------- |
| 0 to 3             | The IP address of the LED Device                    |
| n _ 4 to n _ 4 + 3 | The RGBW values for the LED a index "n" (1 indexed) |

## MariaDB
