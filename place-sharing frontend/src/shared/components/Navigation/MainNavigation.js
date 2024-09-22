import React, { useState } from 'react'

import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import MainHeader from './MainHeader'
import SideDrawer from './SideDrawer'
import NavLinks  from './NavLinks'
import Backdrop from '../UIElements/Backdrop'
import './MainNavigation.css'

const MainNavigation = (props) => {
const [isDrawerOpen,setisDrawerOpen]= useState(false)

const drawerOpenHandler = ()=>{
    setisDrawerOpen(true)
   
  }

  const drawerCloseHandler = ()=>{
    setisDrawerOpen(false)
   
  }
  return (
        <React.Fragment>
        {isDrawerOpen && <Backdrop onClick={drawerCloseHandler}></Backdrop>}
        
        <SideDrawer show={isDrawerOpen} onClick={drawerCloseHandler}>
          <nav className='main-navigation__drawer-nav'>
            <NavLinks />
          </nav>
        </SideDrawer>
        <MainHeader >
            <button className="main-navigation__menu-btn" onClick={drawerOpenHandler}>
                <span />
                <span />
                <span />
            </button>
            <h1 className='main-navigation__title'>
            <Link to='/'>Your Places</Link> 
            </h1>
            <nav className='main-navigation__header-nav'>
              <NavLinks/>
            </nav>
            
        </MainHeader>
        </React.Fragment>
  )
}

export default MainNavigation