import React, { useState } from 'react'
import './AddEmployee.css'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import axios from 'axios';


function AddEmployee() {

  const [formData, setFormData] = useState({
    shopName: '',
    owner_name: '',
    address: '',
    email: '',
    contact_no: '',
  });

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    console.log('Form data:', formData);
    const { shopName, owner_name, address, email, contact_no } = formData
    if (!token) {
      alert('You are not authorized');
      return;
    }
    if (!shopName || !owner_name || !address || !email || !contact_no) {
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
        alert('Shop added successfully:', response.data);
        setFormData({
          shopName: '',
          owner_name: '',
          address: '',
          email: '',
          contact_no: '',
        });
        alert('Shop added successfully');
      } catch (error) {
        console.error('Error adding shop:', error);
        alert('Error adding shop:', error);
      }
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
                      label="Employee Name"
                      name="shopName"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  className="mb-4"
                  label="Designation"
                  name="owner_name"
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
                  type="tel"
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
                    Add Employee
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

export default AddEmployee