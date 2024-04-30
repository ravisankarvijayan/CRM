import React, { useEffect, useState } from 'react'
import './Inventory.css'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Swal from 'sweetalert2'
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import EditInventory from '../EditInventory/EditInventory';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



function Inventory() {

  const [productsData, setProductsData] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  // const [selectedProducts, setSelectedProducts] = useState([]);
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [searchText, setSearchText] = useState('')


  const fetchInventory = async () => {
    const token = localStorage.getItem('token')
    const shop_name = localStorage.getItem('shop_name');
    console.log('token', token);
    if (!token) {
      alert('You are not authorised')
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/shop_app/products/',
        {
          headers: {
            Authorization: `Token ${token}`
          }
        });
      console.log(response.data.products);
      const filteredProducts = response.data.products.filter(product => product.shop_name === shop_name);
      setProductsData(filteredProducts)
      setFilteredProducts(filteredProducts)
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/shop_app/products/${id}`, {
        headers: {
          Authorization: `token ${token}`
        }
      })
      // alert('product deleted successfully')
      Swal.fire({
        title: "Success!",
        text: "Product deleted succesffully!",
        icon: "success"
      });

      handleClose()

      fetchInventory()
    } catch (error) {
      alert(error)
    }
    // Swal.fire({
    //   position: "center",
    //   icon: "success",
    //   title: "Product has been deleted",
    //   showConfirmButton: false,
    //   timer: 1500
    // });
  }

  const handleChange = (e) => {
    setSearchText(e.target.value)
    console.log(searchText);
  }




  const handleSearch = () => {
    const filteredProducts = productsData.filter(product =>
      product.product_name.toLowerCase().trim().includes(searchText.toLowerCase().trim()) ||
      product.pro_company.toLowerCase().trim().includes(searchText.toLowerCase().trim())
    )
    console.log('filtered data', filteredProducts)

    setFilteredProducts(filteredProducts)
  }




  return (
    <>
      <div className='mx-5 mb-0'>

        <Link to={'/add-products'}><button className='btn btn-primary'>Add Products</button>
        </Link>
      </div>
      <div className='container-fluid col-6 d-flex gap-3'>
        <input className='p-2 form-control ' onKeyDown={handleSearch} onChange={handleChange} type="text" placeholder='Search product' />
        {/* <button className='btn btn-primary' onClick={handleSearch}>Search</button> */}
      </div>


      <div className="productCards m-5">
        <div className="row flex-wrap">
          {
            filteredProducts.map((product, index) => (
              <div key={index} className="col-4">

                <Card sx={{ maxWidth: 345 }} className='mb-5'>
                  <Link to={`/ViewProduct/${product.id}`}>
                    <CardActionArea>
                      <CardMedia className='img'
                        component="img"
                        height="140"
                        image={`http://127.0.0.1:8000${product.image}`}
                        alt="Product Image"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {product.pro_company} - {product.product_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Link>
                  <CardActions className='d-flex justify-content-center '>
                    <div onClick={(e) => e.stopPropagation()} className='d-flex gap-5 mb-3'>
                      <Link to={`/EditInventory/${product.id}`}>
                        <FaEdit />
                      </Link>
                      <Link to={`/ViewProduct/${product.id}`}>
                        <FaEye />
                      </Link>


                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete your product?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            This action cannot be undone.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button onClick={() => handleDelete(product.id)} autoFocus>
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <button onClick={handleClickOpen}>
                        <MdDelete />
                      </button>
                    </div>
                  </CardActions>
                </Card>
              </div>
            ))
          }
        </div>
      </div>

    </>
  )
}

export default Inventory