import React, { useEffect, useState } from 'react'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2'

function UpdateStock() {


  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const { id } = useParams()

  const [formData, setFormData] = useState({
    pro_company: '',
    productname: '',
    quantity: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUpdateStock = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/shop_app/stocks/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`
            },
          }
        );
        setResult(response.data);
        console.log(response)
        if (response.data) {
          setFormData({
            pro_company: response.data.pro_company || '',
            productname: response.data.productname || '',
            quantity: response.data.quantity || ''
          });
        }
      }
      catch (error) {
        console.error('error fetching update Stock data');
        alert('error fetching update Stock data');
      }
    }
    fetchUpdateStock()
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put(`http://127.0.0.1:8000/shop_app/stocks/${id}/`,
        formData, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      // alert('updated')
      Swal.fire({
        title: "Success!",
        text: "Form submitted successfully!",
        icon: "success"
      });
      setTimeout(() => {
        navigate(-1)
      }, [1000])
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <MDBContainer fluid className="mt-5 shopAddWrapper col-6">
        <section>
          <MDBRow className="justify-content-center">
            <MDBCol lg="8">
              <form>
                <MDBRow>
                  <MDBCol>
                    <MDBInput
                      className="mb-4"
                      label='Product Company'
                      name="pro_company"
                      value={formData.pro_company}
                      onChange={handleChange}
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
                    Save Changes
                  </button>
                </div>
              </form>
            </MDBCol>
          </MDBRow>
        </section>
      </MDBContainer>

    </>
  )
}

export default UpdateStock