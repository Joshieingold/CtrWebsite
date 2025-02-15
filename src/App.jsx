
import './App.css'
import CTR from './CtrPage/ctrpage.jsx'
import HeaderNav from './HeaderNav/headernav.jsx'
import Navbar from './Navbar/navbar.jsx'

function App() {

  return (
    <>
    <div className='MainComponent'>
      <Navbar className="NavComponent"/>
        <div className='ScreenContent'>
          <HeaderNav className="HeaderNavComponent"/>
        
          <CTR className="CTRDataComponent"/>
        </div>
    </div>
      

    </>
  )
}

export default App
