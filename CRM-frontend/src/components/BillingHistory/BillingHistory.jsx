import React, { useEffect, useState } from 'react'
import './BillingHistory.css'
import axios from 'axios'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function BillingHistory() {
  const [billingHistoryData, setBillingHistoryData] = useState([])
  const [billingDetails, setBillingDetails] = useState([])
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchBillingHistoryData = async () => {
      const token = localStorage.getItem('token')
      const shop_name = localStorage.getItem('shop_name')
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop_app/billing-details/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          })
        // console.log(response);

        // Filter billing history data based on shop_name
        const filteredBillingHistory = response.data.filter(billing => billing.shop_name === shop_name)
        console.log("filtered billing history", filteredBillingHistory)
        setBillingHistoryData(filteredBillingHistory)
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchBillingHistoryData()
  }, [])


  return (
    <>
      {/* <div className="date ms-5">
        <input type="date" className='form-control' />
      </div> */}

      <div className="history mt-3 mb-5">

        {
          billingHistoryData ? (
            billingHistoryData.map((billing, index) => (
              <Accordion expanded={expanded === `panel${index}`} // Use index to manage expanded state
                onChange={handleChange(`panel${index}`)} // Use index for onChange function
                className='mx-5'>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Name: {billing.customer_name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', width: '33%', flexShrink: 0 }}>Invoice Number: {billing.invoice_number}</Typography>
                  <Typography sx={{ color: 'text.secondary', width: '33%', flexShrink: 0 }}>Total: {billing.grand_total}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell >Quantity</TableCell>
                            <TableCell >Price</TableCell>
                          </TableRow>
                        </TableHead>
                        {
                          billing.billing_details.map((data, index) => (
                            <TableBody>

                              <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {data.product_name}
                                </TableCell>
                                <TableCell>{data.quantity}</TableCell>
                                <TableCell>{data.total_amount}</TableCell>

                              </TableRow>

                            </TableBody>
                          ))
                        }
                      </Table>
                    </TableContainer>
                    <p>
                      {
                        billing ?
                          <>
                            <p className='mt-2'>Coupon applied:  {billing.coupon_code}</p>
                            <p className='mt-2'>Billing date:  {billing.billing_date}</p>
                          </>
                          :
                          'No Coupons Applied'
                      }
                    </p>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) :
            <p className=''>No Billings found for this shop</p>
        }

      </div>
    </>
  )
}

export default BillingHistory