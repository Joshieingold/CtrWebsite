import "./headernav.css";
import React from 'react';
import Logo from "../assets/logo.png"

function HeaderNav() {
  return (
    <div className='HeadNavMain'>
        <div className="BrandDetails">
            <div className='LogoContainer'>
                <img src={Logo} className="logoImg"></img>
            </div>
            <h3 className='Title'>CTR Daily Run</h3>
        </div>

    </div>
  );
}

export default HeaderNav;
