import axios from 'axios'
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'

function AddStock() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    pro_company: '',
    productname: '',
    quantity: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    console.log(token)
    const { product_name, pro_company, quantity } = formData;

    
    
      try {
        const response = await axios.post('http://127.0.0.1:8000/shop_app/stocks/', formData,
          {
            headers: {
              Authorization: `token ${token}`
            }
          })
        // alert('Stock added successfully');
        Swal.fire({
          title: "Success!",
          text: "Stock was added successfully!",
          icon: "success"
        });
        setFormData({
          pro_company: '',
          productname: '',
          quantity: ''
        })
        setTimeout(() => {
          navigate(-1)
        }, [1000])
  
  
      } catch (error) {
        alert('Error adding shop', error)
      }
    
   
  }


  return (
    <>
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
                        label="Product Company"
                        name="pro_company"
                        onChange={handleChange}
                        value={formData.pro_company}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBInput
                    className="mb-4"
                    label="Product Name"
                    name="productname"
                    value={formData.productname}
                    onChange={handleChange}
                  />
                  <MDBInput
                    className="mb-4"
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    type='number'
                  />

                  <div className="text-center">
                    <button
                      className="btn btn-primary col-6"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Add Stock
                    </button>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </section>
        </MDBContainer>
      </div>
    </>
  )
}

export default AddStock