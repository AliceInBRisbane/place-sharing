import React from 'react'
import ReactDOM from 'react-dom';
import './Backdrop.css'

const Backdrop = (props) => {
 
   const cateloge =<div className='backdrop' onClick= {props.onClick}></div>
   return  ReactDOM.createPortal( cateloge, document.getElementById('backdrop-hook'));
}

export default Backdrop;