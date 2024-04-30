import React, { useEffect, useState } from 'react'
import './Home.css'
// import img from '../../../assets/wp6733581.jpg'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Chart from './Chart';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



function Home() {

  const [userDetails, setUserDetails] = useState({})
  const [shopListDetails, setShopListDetails] = useState([])

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const loggedInId = localStorage.getItem('id');
        console.log(loggedInId)
        const response = await axios.get('http://127.0.0.1:8000/shop_app/register/')
        console.log(response.data);
        // console.log(response);
        const loggedInUserDetails = response.data.find(user => user.id == loggedInId);
        // setUserDetails(response.data)
        if (loggedInUserDetails) {
          setUserDetails(loggedInUserDetails);
        } else {
          console.log('Logged-in user details not found.');
        }
        // console.log(userDetails);
      }
      catch (error) {
        console.log(error);
      }
    }
    userData();

    const fetchShopList = async () => {
      const token = localStorage.getItem('token')
      console.log(token)
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop_app/shops/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          })
        console.log('shop', response.data)
        // setShopListDetails(response.data)

        //fetching shops by the logged in user only
        const user = localStorage.getItem('user')
        const shopListOfLoggedinUser = response.data.filter(shop => String(shop.user) === user)
        setShopListDetails(shopListOfLoggedinUser)
        console.log(shopListDetails)

        console.log(shopListDetails)
      } catch (error) {
        console.log(error)
      }
    }

    fetchShopList()
  }, [])

  const deleteShop = async (id) => {
    const token1 = localStorage.getItem('token')
    console.log(token1)
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/shop_app/shops/${id}/`,
        {
          headers: {
            Authorization: `token ${token1}`
          }
        })
      // window.location.reload()
      // Filter out the deleted shop from shopListDetails
      setShopListDetails(prevShopList => prevShopList.filter(shop => shop.id !== id));
      handleClose()

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <div className="container mt-5">
        <div className="row w-75 mx-auto p-5 justify-content-around align-items-center border rowWrapper ">
          <div className="col-6 homeLeft">
            <h3 className='text-center my-3 '>OWNER PROFILE</h3>


            <div className="ownerDetails">

              <table>
                <tbody>
                  <tr>
                    <td className='fw-bold '>Name:</td>
                    <td>{userDetails.username}</td>
                  </tr>
                  <tr>
                    <td className='fw-bold'>Email:</td>
                    <td>{userDetails.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-4 homeRight">
            <h5 className='text-center shopsSection mb-3'>SHOPS</h5>
            {
              shopListDetails.map((shopList, index) => (
                <div key={index} className="shopListWrapper d-flex justify-content-center align-items-center w-100 mb-3 text-center gap-5">
                  <Link to={`/editShop/${shopList.id}`}><i className="fa-solid fa-edit icons"></i></Link>
                  <p className='mb-0 text-center'><Link to={`/shopDetails/${shopList.id}`}>{shopList.shop_name}</Link></p>
                  <i className="fa-solid fa-xmark icons" onClick={handleClickOpen}></i>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete your shop?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={() => deleteShop(shopList.id)} autoFocus>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>

                </div>
              ))
            }

            <Link to={'/addShop'}><div className="btn btn-primary" style={{ width: '150px' }}>Add Shop</div></Link>
            <Link to={'/stocks'}><div className="btn btn-primary mt-2" style={{ width: '150px' }}>Stocks</div></Link>
            <Link to={'/offer-posting'}><div className="btn btn-primary mt-2" style={{ width: '150px' }}>Offers</div></Link>
            {/* <Link to={'/service-requests'}><div className="btn btn-primary mt-2" style={{ width: '150px' }}>Service</div></Link> */}
          </div>
        </div>
      </div>

    </>
  )
}

export default Home