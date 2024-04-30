import React from 'react'
import './BackButton.css'
import { useLocation, useNavigate } from 'react-router'

function BackButton() {

  const location = useLocation();
  const isLogin = location.pathname === '/'
  const isRegister = location.pathname === '/register'
  const isHome = location.pathname === '/home'
  const navigate = useNavigate()

  const handleBackButton = () => {
    navigate(-1);
  }
  return (
    <>
      <button className='btn btn-outline-primary ms-5 m-3' style={{ display: isLogin || isRegister || isHome ? 'none' : '' }} onClick={handleBackButton}>
        &lt;
        &lt;
        Go Back
      </button>
    </>
  )
}

export default BackButton