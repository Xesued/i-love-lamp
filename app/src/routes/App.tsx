import { useState, useEffect } from 'react'
import { HexColorPicker } from "react-colorful";
import { io } from 'socket.io-client';
import { Button } from "@nextui-org/react";

import './App.css'


function App() {
  const socket = io('http://192.168.12.209:3000');
  const [color, setColor] = useState("aabbcc");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [selectedLamps, setSelectedLamps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isConnected) return;
    console.log('Sending color', color);
    socket.emit("color-change", color)
  }, [isConnected, color]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const handleSelectLamp = (lampId: string) => {
    setSelectedLamps({
      ...selectedLamps,
      [lampId]: selectedLamps[lampId] ? !selectedLamps[lampId] : true,
    })
  }

  return (
    <div className='flex flex-col p-4 gap-4'>
      <div className='flex-none'>
        <ul className='flex flex-row align-middle gap-4'>
          <li>
            <Button 
              variant={selectedLamps['lamp-1'] ? 'solid' : 'ghost'}
              color={selectedLamps['lamp-1'] ? 'success' : 'primary'}
              onClick={() => handleSelectLamp('lamp-1')}>
                Lamp 1
            </Button>
          </li>
          <li>
            <Button 
              variant={selectedLamps['lamp-2'] ? 'solid' : 'ghost'}
              color={selectedLamps['lamp-2'] ? 'success' : 'primary'}
              onClick={() => handleSelectLamp('lamp-2')}>
                Lamp 2
            </Button>
          </li>
        </ul>
      </div>
      <div className='flex-1 color-picker'>
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  )
}

export default App
