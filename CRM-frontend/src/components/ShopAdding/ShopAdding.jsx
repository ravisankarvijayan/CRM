import React, { useState } from 'react';
import './ShopAdding.css';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import { Navigate, useNavigate } from 'react-router';
import Swal from 'sweetalert2'
import YupValidation from '../Yupvalidation/Validation.jsx'

function ShopAdding() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    user: [''],
    shop_name: '',
    address: '',
    contact_no: '',
    email: ''
  });

  console.log(formData);

  const handleSubmit = async (e) => {

    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    console.log('Form data:', formData);
    const { user, shop_name, address, contact_no, email } = formData;
    if (!token) {
      alert('You are not authorized');
      return;
    }

    if (!user || !shop_name || !address || !contact_no || !email) {
      alert('please fill the form completely')
    }
    else {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/shop_app/shops/',
          formData,
          {
            headers: {
              Authorization: `Token ${token}`
            },
          }
        );
        console.log('Response:', response.data);
        // alert('Shop added successfully:', response.data);
        setFormData({
          user: [''],
          shop_name: '',
          address: '',
          contact_no: '',
          email: ''
        });
        // alert('Shop added successfully');
        Swal.fire({
          title: "Success!",
          text: "Shop has been added!",
          icon: "success"
        });
        navigate('/home')

      } catch (error) {
        console.error('Error adding shop:', error);
        alert('Error adding shop:', error);
      }
    }

  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'user') { // If the field is 'user'
      setFormData({ ...formData, [name]: [value] }); // Wrap value in an array
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <MDBContainer fluid className="mt-5 shopAddWrapper col-6">
      <section>
        <MDBRow className="justify-content-center">
          <MDBCol lg="8">
            <form>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    className="mb-4"
                    label="Owner Name"
                    name="user"
                    onChange={handleChange}
                    value={formData.user['']}
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                className="mb-4"
                label="Shop Name"
                name="shop_name"
                value={formData.owner_name}
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
                  Add Shop
                </button>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
}

export default ShopAdding;
