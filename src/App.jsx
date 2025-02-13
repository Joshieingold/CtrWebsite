import { useState } from 'react'

import CTR from './CtrPage/ctrpage.jsx'
import './App.css'
import Navbar from './Navbar/navbar.jsx'
import HeaderNav from './HeaderNav/headernav.jsx'

function App() {

  return (
    <>
      <HeaderNav/>
      <Navbar />
      <CTR />
    </>
  )
}

export default App
