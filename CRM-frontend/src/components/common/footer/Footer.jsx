import React from 'react'
import './Footer.css'
import { useLocation } from 'react-router'

function Footer() {

  const location = useLocation()
  const isLogin = location.pathname === '/'
  const isRegister = location.pathname === '/register'
  return (
    <>
      <div className="footer-wrapper" style={{ display: isLogin || isRegister ? "none" : '' }}>
        <p>Terms and Conditions</p>
        <p>Privacy Policy</p>
        <p>Customer Policy</p>
        <p><i className="fa-regular fa-copyright"></i>CRMApp 2024</p>
      </div>
    </>
  )
}

export default Footer