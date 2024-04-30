import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


function OfferPosting() {


  const [offer, setOffer] = useState([])

  const [data, setData] = useState({
    shop_name: '',
    title: '',
    starting_date: '',
    ending_date: '',
    offer_description: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: (value) })
    console.log(data)
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const { shop_name, title, starting_date, ending_date, offer_description } = data;

      try {
        const response = await axios.post('http://127.0.0.1:8000/shop_app/offers/',
          data,
          {
            headers: {
              Authorization: `token ${token}`
            }
          })
        setOffer(response.data)
        Swal.fire({
          title: "Success!",
          text: "Offer posted succesffully!",
          icon: "success"
        });

      } catch (error) {
        console.log(error)
      }
    
  }



  return (
    <>

      <div className='mx-5'>
        <Link to={'/addCoupons'}>
          <button className='btn btn-primary'>Add Coupons</button>
        </Link>
      </div>

      <h2 className='text-center mb-3'>Post Offers</h2>



      <div className='d-flex justify-content-center '>

        <div className="formWrapper w-50">
          <input type="text" className='form-control mb-3' placeholder='Shop Name' onChange={handleChange} value={data.shop_name} name="shop_name" id="" />
          <input type="text" className='form-control mb-3' placeholder='Offer Title' onChange={handleChange} value={data.title} name="title" id="" />
          <input type="date" className='form-control mb-3' placeholder='Offer Starting Date' onChange={handleChange} value={data.starting_date} name="starting_date" id="" />
          <input type="date" className='form-control mb-3' placeholder='Offer Ending Date' onChange={handleChange} value={data.ending_date} name="ending_date" id="" />
          <input type="text" className='form-control mb-3' placeholder='Offer Description' onChange={handleChange} value={data.offer_description} name="offer_description" id="" />
        </div>

      </div>
      <div className="button text-center mb-3">
        <button className='btn btn-primary' onClick={handleSubmit}>Post Offer</button>
      </div>
    </>
  )
}

export default OfferPosting