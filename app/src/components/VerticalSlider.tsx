import { useState } from 'react'

export default function VerticalSlider() {
    const [position, setPosition] = useState(0);
    return (
        <div>
            <div className="slider w-4 relative bg-slate-100" style={{ width: 20, height: 300 }}>
                <div className="absolute bubble w-4 bg-cyan-50"
                style={{top: '10%'}}></div>
            </div>
        </div>
    )
}