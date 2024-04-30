import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from 'react-select';

const DISCOUNT = 0;

let nextRowId = 0;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { id: nextRowId++, desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

function Billing() {
  const navigate = useNavigate(); // Moved useNavigate hook declaration here

  // State variables
  const [productsData, setProductsData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
  const [invoiceTaxes, setInvoiceTaxes] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [formData, setFormData] = useState({
    shop_name: '',
    customer_name: '',
    phone_number: '',
    email: '',
    invoice_number: '',
    coupon_code: '',
    payment_status: '',
    payment_method: '',
    products: [] // Products will be an array of objects
  });

  // Fetch data from the API and set tableData
  useEffect(() => {
    const fetchBillingData = async () => {
      const token = localStorage.getItem('token');
      const shop_name = localStorage.getItem('shop_name');
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop_app/products/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        const filteredProducts = response.data.products.filter(prod => prod.shop_name === shop_name)
        setProductsData(filteredProducts);
        console.log('filtered data', filteredProducts)
      } catch (error) {
        console.log('Error:', error);
      }
    };
    fetchBillingData();
  }, []);

  // Construct products array from tableRows and update formData
  useEffect(() => {
    const constructProductsArray = () => {
      return tableRows.map(row => ({
        product_name: row.desc.split(' - ')[1], // Extracting only product name
        quantity: row.qty,
        // unit_price: row.unit // Assuming unit price is required in backend
      }));
    };
    setFormData(prevState => ({
      ...prevState,
      products: constructProductsArray()
    }));
  }, [tableRows]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const shop_name = localStorage.getItem('shop_name')
    console.log(shop_name)

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/shop_app/billing-details/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const recommendationAPI = await axios.get(`http://127.0.0.1:8000/shop_app/recommendation-emails/${shop_name}/`,
        {
          headers: {
            Authorization: `token ${token}`
          }
        })
      console.log(recommendationAPI)

      Swal.fire({
        title: 'Billing saved successfully!',
        icon: 'success'
      });

      navigate(-1);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // Handle product selection
  const handleProductSelect = (selectedOptions) => {
    const selectedRows = selectedOptions.map(option =>
      createRow(option.label, 1, option.price)
    );
    const selectedSubtotal = subtotal(selectedRows);
    const selectedTaxes = DISCOUNT * selectedSubtotal;
    const selectedTotal = selectedSubtotal - selectedTaxes;

    // Update table rows and invoice totals
    setTableRows(selectedRows);
    setInvoiceSubtotal(selectedSubtotal);
    setInvoiceTaxes(selectedTaxes);
    setInvoiceTotal(selectedTotal);
  };

  // Handle quantity change
  const handleQuantityChange = (id, newQty) => {
    const updatedRows = tableRows.map(row =>
      row.id === id ? { ...row, qty: newQty, price: priceRow(newQty, row.unit) } : row
    );

    // Calculate updated subtotal, taxes, and total
    const updatedSubtotal = subtotal(updatedRows);
    const updatedTaxes = DISCOUNT * updatedSubtotal;
    const updatedTotal = updatedSubtotal - updatedTaxes;

    // Update state only once with the new rows and totals
    setTableRows(updatedRows);
    setInvoiceSubtotal(updatedSubtotal);
    setInvoiceTaxes(updatedTaxes);
    setInvoiceTotal(updatedTotal);
  };
  return (
    <>
      {/* Shop details */}
      {/* Contact details */}
      {/* Product selection */}

      <form action="" onSubmit={handleSubmit}>

        <div className='d-flex ms-5 gap-5 '>
          <div className='col-4'><input className='form-control' type="text" placeholder='Shop Name' name='shop_name' onChange={handleChange} value={formData.shop_name} /></div>
        </div>
        <div className='d-flex ms-5 gap-5 mt-3'>
          <div className='col-4'><input className='form-control' type="text" placeholder='Name' name='customer_name' onChange={handleChange} value={formData.customer_name} /></div>
          <div className='col-4'><input className='form-control' type="text" placeholder='Email' name='email' onChange={handleChange} value={formData.email} /></div>
        </div>
        <div className='d-flex align-items-center mt-3 ms-5 gap-5'>
          <div className='col-4'><input className='form-control' type="text" placeholder='Contact No' name='phone_number' onChange={handleChange} value={formData.phone_number} /></div>
          <div className='col-4'><input className='form-control' type="text" placeholder='Invoice' name='invoice_number' onChange={handleChange} value={formData.invoice_number} /></div>
        </div>


        <div className='col-6 ms-5'>
          <Select
            isMulti
            name='products'
            options={productsData.map(product => ({
              value: product.id,
              label: `${product.pro_company} - ${product.product_name}`,
              price: product.selling_price // Include product price in the option
            }))}
            placeholder='Select Products...'
            onChange={handleProductSelect}
            className='mt-3'
          />
        </div>

        {/* Table for displaying selected products */}
        <TableContainer component={Paper} className='p-5'>
          <Table aria-label='spanning table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Qty.</TableCell>
                <TableCell align='right'>Unit</TableCell>
                <TableCell align='right'>Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell align='right'>
                    <button type='button' className='me-2' onClick={() => handleQuantityChange(row.id, row.qty - 1)}>-</button>
                    {row.qty}
                    <button type='button' className='ms-2' onClick={() => handleQuantityChange(row.id, row.qty + 1)}>+</button>
                  </TableCell>
                  <TableCell align='right'>{row.unit}</TableCell>
                  <TableCell align='right'>{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))}
              {/* <TableRow>
                <TableCell colSpan={3}>Subtotal</TableCell>
                <TableCell align='right'>{ccyFormat(invoiceSubtotal)}</TableCell>
              </TableRow> */}
              {/* <TableRow>
                <TableCell colSpan={3}>Discount</TableCell>
                <TableCell align='right'>{`${(DISCOUNT * 100).toFixed(0)} %`}</TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell align='right'>{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div className='col-8 mt-5 d-flex gap-5 container-fluid justify-content-center align-items-center'>
          <div className="coupon">
            <input type="text" id="" placeholder='Enter Coupon Code' className='form-control' name='coupon_code' onChange={handleChange} value={formData.coupon_code} />
          </div>
        </div>

        <div className='d-flex justify-content-center gap-5 mt-3'>
          <div className="payment-method">
            <label >Payment Method</label>
            <select className='form-control' id="" name='payment_method' onChange={handleChange} value={formData.payment_method} >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div className="payment-status">
            <label >Payment Status</label>
            <select className='form-control' id="" name='payment_status' onChange={handleChange} value={formData.payment_status} >
              <option value="">Select</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>

        </div>

        <div className='p-4 d-flex justify-content-center'>
          <button className='btn btn-primary mb-5' type='submit'>save</button>
        </div>

      </form>
    </>
  );
}

export default Billing;
