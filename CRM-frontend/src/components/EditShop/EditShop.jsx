import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2'

function EditShop() {

  const [result, setResult] = useState(null)
  const { id } = useParams()

  const [formData, setFormData] = useState({
    user: [''],
    shop_name: '',
    address: '',
    contact_no: '',
    email: ''
  });

  const navigate = useNavigate()

  // console.log(formData);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized');
      return;
    }
    const fetchCurrentShopData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/shop_app/shops/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`
            },
          }
        );
        setResult(response.data);
        // Set form data only if result is available
        if (response.data) {
          setFormData({
            user: response.data.user || [''],
            shop_name: response.data.shop_name || '',
            address: response.data.address || '',
            contact_no: response.data.contact_no || '',
            email: response.data.email || ''
          });
        }
      }
      catch (error) {
        console.error('Error fetching shop data:', error);
        alert('Error fetching shop data:', error);
      }
    }
    fetchCurrentShopData();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'user') { // If the field is 'user'
      setFormData({ ...formData, [name]: [value] }); // Wrap value in an array
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put(`http://127.0.0.1:8000/shop_app/shops/${id}/`,
        formData, {
        headers: {
          Authorization: `token ${token}`
        }
      })
      // alert('form submitted')
      Swal.fire({
        title: "Success!",
        text: "Your data is submitted!",
        icon: "success"
      });

      setTimeout(() => {
        navigate('/home')
      }, [1000])

    } catch (error) {
      alert(error)
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
                      label='Username'
                      name="username"
                      value={formData.user}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  className="mb-4"
                  label="Shop Name"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                />
                <MDBInput
                  className="mb-4"
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <MDBInput
                  className="mb-4"
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <MDBInput
                  className="mb-4"
                  label="Contact No."
                  type="number"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
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

export default EditShop