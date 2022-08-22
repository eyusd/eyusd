import React from 'react'
import "./navbar.css"
import { Navbar  as ReactNavbar} from 'responsive-navbar-react';
import 'responsive-navbar-react/dist/index.css'

const Navbar = () => {
  const props = {
    items: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Links',
        link: '/links'
      },
      {
        text: 'Titles',
        link: '/titles'
      },
    ],
    logo: {
      text: 'eyusd.'
    },
    style: {
      barStyles: {
        background: 'none',
        boxShadow: 'none'
      },
      sidebarStyles: {
        background: '#000',
        buttonColor: 'white'
      }
    },
    float: true
  }
  return <ReactNavbar {...props} />
}

export default Navbar;