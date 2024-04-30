import React, { useEffect, useState } from 'react'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Await, useNavigate, useParams } from 'react-router';



function EditInventory() {

  const navigate = useNavigate()

  //get
  const [result, setResult] = useState(null)
  const { id } = useParams()
  console.log(id)

  const [data, setData] = useState({
    shop_name: '',
    pro_company: '',
    product_name: '',
    description: '',
    price: '',
    selling_price: '',
  });
  const [image, setImage] = useState()
  const [csv, setCsv] = useState()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/shop_app/products/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`
            },
          }
        );
        setResult(response.data);
        console.log(response.data)
        if (response.data) {
          setData({
            shop_name: response.data.data.shop_name || '',
            // image:response.data.data.image || '',
            pro_company: response.data.data.pro_company || '',
            product_name: response.data.data.product_name || '',
            description: response.data.data.description || '',
            price: response.data.data.price || '',
            selling_price: response.data.data.selling_price || ''
          });
        }

      }
      catch (error) {
        console.error('error fetching inventory data', error);
        alert('error fetching inventory data', error);
      }
    }
    fetchInventoryData();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };
  console.log(data)


  const formData = new FormData()
  formData.append("shop_name", data.shop_name)
  formData.append("pro_company", data.pro_company)
  formData.append("product_name", data.product_name)
  formData.append("description", data.description)
  formData.append("price", data.price)
  formData.append("selling_price", data.selling_price)
  formData.append("image", image)
  formData.append("cdv_file", csv)



  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put(`http://127.0.0.1:8000/shop_app/products/${id}/`,
        formData, {
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      // alert('succesfully edited')
      Swal.fire({
        title: "Success!",
        text: "Product edited succesffully!",
        icon: "success"
      });

      navigate(-1)
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
                      label="Shop Name"
                      name="shop_name"
                      value={data.shop_name}
                      onChange={handleChange}

                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  className="mb-4"
                  label="Product Company"
                  name="pro_company"
                  value={data.pro_company}
                  onChange={handleChange}

                />
                <MDBInput
                  className="mb-4"
                  label="Product Name"
                  name="product_name"
                  value={data.product_name}
                  onChange={handleChange}

                />
                <MDBInput
                  className="mb-4"
                  label="Description "
                  name="description"
                  value={data.description}
                  onChange={handleChange}

                />
                <MDBInput
                  className="mb-4"
                  label="Price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  type='number'

                />
                <MDBInput
                  className="mb-4"
                  label="Selling Price "
                  name="selling_price"
                  type='number'
                  value={data.selling_price}
                  onChange={handleChange}


                />
                {/* <MDBInput
                  className="mb-4"
                  label="Stock Quantity "
                  name="stock_quantity"
                  value={data.stock_quantity}
                  type='number'
                  onChange={handleChange}

                /> */}
                <label htmlFor="">Choose product image</label>
                <MDBInput
                  className="mb-4"
                  type='file'
                  name="image"
                  // value={data.image}
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="">Choose CSV File</label>
                <MDBInput
                  className="mb-4"
                  type='file'
                  name="image"
                  // value={data.image}
                  onChange={(e) => setCsv(e.target.files[0])}
                />
                <div className="text-center">
                  <button
                    className="btn btn-primary col-6"
                    type="submit"
                    onClick={handleSubmit}
                  >

                    save Changes
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

export default EditInventory