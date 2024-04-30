import React, { useEffect, useState } from 'react'
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import { useNavigate } from 'react-router'
import axios from 'axios'
import Swal from 'sweetalert2'



function AddCoupon() {
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    coupon_code: '',
    amount: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    console.log(token)
    // const { coupon_code, amount } = formData;

      try {
        const response = await axios.post('http://127.0.0.1:8000/shop_app/coupons/', formData,
          {
            headers: {
              Authorization: `token ${token}`
            }
          })
        // alert('Stock added successfully');
        Swal.fire({
          title: "Success!",
          text: "Coupon was added successfully!",
          icon: "success"
        });
        setFormData({
          coupon_code: '',
          amount: '',

        })
        setTimeout(() => {
          navigate(-1)
        }, [1000])
  
  
      } catch (error) {
        alert('Error adding coupon', error)
        console.log(error)
      }
    
   
  }

  return (
    <div>
      <div className='addStockForm'>
        <MDBContainer fluid className="mt-5 shopAddWrapper col-6">
          <section>
            <MDBRow className="justify-content-center">
              <MDBCol lg="8">
                <form>
                  <MDBRow>
                    <MDBCol>
                      <MDBInput
                        className="mb-4"
                        label="Coupon Code"
                        name="coupon_code"
                        onChange={handleChange}
                        value={formData.coupon_code}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    className="mb-4"
                    label="Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                  

                  <div className="text-center">
                    <button
                      className="btn btn-primary col-6"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Add Coupon
                    </button>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </section>
        </MDBContainer>
      </div>
    </div>
  )
}

export default AddCoupon