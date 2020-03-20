import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
//import face from '../face.png';
import face2 from '../face2.png';

const Logo = () => {
    return (
       <div className="ma4 mt0">
        <Tilt className="Tilt br2 shadow-2 img" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
        <div className="Tilt-inner"> 
        <img src = {face2} 
        style={{ paddingTop : '5px' }} 
        alt="Logo"/> </div>
        </Tilt>
       </div>
    );
}


export default Logo;
