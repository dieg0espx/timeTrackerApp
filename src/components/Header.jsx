import React, { useState } from 'react'
import logo from '../images/sideLogo.png'
import Metrics from "./Metrics";

function Header() {
  const [showMetrics, setShowMetrics] = useState(false);
  return (
    <div className='wrapper-header'>
      <img src={logo} />
      <button onClick={()=> setShowMetrics(!showMetrics)}> <i className="bi bi-sliders"></i> </button>
      <Metrics showMetrics={showMetrics} setShowMetrics={()=>setShowMetrics(false)}/>
    </div>
  )
}

export default Header
