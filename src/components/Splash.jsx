import React from 'react'
import text from '../images/sometext.png'
import icon from '../images/yourlogo.png'
import { useState } from 'react';

function Splash() {
    const [showSplash, setShowSplash] = useState(true);

    setTimeout(()=>setShowSplash(false), 5000);
  return (
    <div className={"splash"} style={{display: showSplash? "block":"none"}}>
        <div className="splash-wrapper">
            <img className='splash-icon' src={icon} />
            <img className='splash-text' src={text} />
        </div>
    </div>
  )
}

export default Splash
