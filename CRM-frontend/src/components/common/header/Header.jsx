import React from 'react'
import './Header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import logo from '../../../assets/CRM_logo.png'


function Header() {

  const location = useLocation()
  const isLogin = location.pathname === '/'
  const isRegister = location.pathname === '/register'
  const navigate = useNavigate()


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  function logout() {
    localStorage.clear();
    handleClose()
    navigate('/')
  }


  return (
    <>
      <div className='container-fluid header-wrapper'>
        {/* <h3><Link className='CRM-heading' to={'/'}>SHOP<b>EASY</b></Link></h3> */}
        <img src={logo} alt="" width={'200px'}/>
        <div className='social-media'>
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-instagram"></i>
          <button className="btn btn-danger" style={{ display: isLogin || isRegister ? "none" : '' }} onClick={handleClickOpen}>LOGOUT</button>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to Logout?"}
            </DialogTitle>
            <DialogContent>
              {/* <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
              </DialogContentText> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={logout} autoFocus>
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default Header