import React, { useEffect, useRef, useState } from 'react';
import './ShopProfile.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ShopProfile() {
  const [fetchedShopDetails, setFetchedShopDetails] = useState({});
  const [fetchChart, setFetchChart] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [productsSold, setProductsSold] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const { id } = useParams();
  const pdfRef = useRef();

  const fetchShopDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/shop_app/shops/${id}`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setFetchedShopDetails(response.data);
      localStorage.setItem('shopID', id);
      localStorage.setItem('shop_name', response.data.shop_name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: 'pie'
      },
      labels: ['Company Price', 'Selling Price', 'Profit', 'Coupon Amount'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }
  });

  const handleFromDateChange = (event) => {
    setSelectedFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setSelectedToDate(event.target.value);
  };

  useEffect(() => {
    const fetchChartDetails = async () => {
      const token = localStorage.getItem('token');
      const currentDate = new Date();
      const currentDateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

      try {
        const response = await axios.get(`http://127.0.0.1:8000/shop_app/profitonmonth/${id}/`, {
          headers: {
            Authorization: `token ${token}`
          }
        });
        console.log(response.data);

        let filteredData = [];

        if (!selectedFromDate && !selectedToDate) {
          // Scenario 1: No dates selected, filter for current date
          filteredData = response.data.filter(data => data.date === currentDateString);
        } else if (selectedFromDate && !selectedToDate) {
          // Scenario 2: Only from date selected, filter from from date to current date
          filteredData = response.data.filter(data => data.date >= selectedFromDate && data.date <= currentDateString);
        } else if (selectedFromDate && selectedToDate) {
          // Scenario 3: Both from and to dates selected, filter within the range
          filteredData = response.data.filter(data => data.date >= selectedFromDate && data.date <= selectedToDate);
        }

        setFetchChart(filteredData);

        // Extract products_sold from each item and flatten them into a single array
        const allProductsSold = filteredData.reduce((acc, item) => {
          return [...acc, ...item.products_sold];
        }, []);

        setProductsSold(allProductsSold);
        console.log(productsSold)

        // Assuming you want to update the chart data based on the filtered data
        if (filteredData.length > 0) {
          const data = filteredData[0]; // Assuming you want the first item for the chart
          const totalProductPrice = data.total_price;
          const totalSellingPrice = data.total_selling_price;
          const profit = totalSellingPrice - totalProductPrice;
          const totalCouponAmount = data.total_coupon_amount;
          const totalProfit = profit - totalCouponAmount;
          const seriesData = [totalProductPrice, totalSellingPrice, totalProfit, totalCouponAmount];
          setChartData((prevChartData) => ({
            ...prevChartData,
            series: seriesData
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChartDetails();
  }, [filterApplied, selectedFromDate, selectedToDate, id]);



  const handleFilterApply = () => {
    setFilterApplied(true);
  };

  const downloadPdf = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <>
      <div ref={pdfRef}>
        <div className="container">
          <div className="row d-flex justify-content-center  mt-3">
            <div className="col-4 homeLeft">
              <h3 className="text-center my-3 ">Shop Profile</h3>
              <div className="ownerDetails">
                <table>
                  <tbody>
                    <tr>
                      <td className='fw-bold'>Shop Name:</td>
                      <td>{fetchedShopDetails.shop_name}</td>
                    </tr>
                    <tr>
                      <td className='fw-bold'>Owner Name:</td>
                      <td>{fetchedShopDetails.user}</td>
                    </tr>
                    <tr>
                      <td className='fw-bold'>Address:</td>
                      <td>{fetchedShopDetails.address}</td>
                    </tr>
                    <tr>
                      <td className='fw-bold'>Email:</td>
                      <td>{fetchedShopDetails.email}</td>
                    </tr>
                    <tr>
                      <td className='fw-bold'>Shop Mobile Number:</td>
                      <td>{fetchedShopDetails.contact_no}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-4 homeRight">
              <Link to={'/inventory'}>
                {' '}
                <button className="btn btn-primary mb-3" style={{ width: '155px' }}>
                  Inventory
                </button>
              </Link>
              <Link to={'/billing'}>
                {' '}
                <button className="btn btn-primary mb-3" style={{ width: '155px' }}>
                  Billing
                </button>
              </Link>
              <Link to={'/service-requests'}>
                {' '}
                <button className="btn btn-primary mb-3" style={{ width: '155px' }}>
                  Service Req
                </button>
              </Link>
              <Link to={'/BillingHistory'}>
                {' '}
                <button className="btn btn-primary" style={{ width: '155px' }}>
                  Billing History
                </button>
              </Link>
            </div>
          </div>
        </div>

        {fetchChart.length > 0 ? (
          <div className="d-flex justify-content-center mt-5 flex-column align-items-center">
            <div id="chart">
              <h1 className="text-center mb-3">Profit Analysis</h1>
              <div className="dates d-flex gap-4">
                <div className="fromDate">
                  <label htmlFor="">From date</label>
                  <input
                    type="date"
                    placeholder="Select from date"
                    className="form-control mb-3"
                    value={selectedFromDate}
                    onChange={handleFromDateChange}
                  />
                </div>
                <div className="toDate">
                  <label htmlFor="">To date</label>
                  <input
                    type="date"
                    placeholder="Select to date"
                    className="form-control mb-3"
                    value={selectedToDate}
                    onChange={handleToDateChange}
                  />
                </div>
              </div>
              <ReactApexChart options={chartData.options} series={chartData.series} type="pie" width={380} />
            </div>
            <div id="html-dist"></div>

            <div>
              <table className='mx-3 border'>
                <thead>
                  <tr>
                    <th>Company Price</th>
                    <th>Selling Price</th>
                    <th>Coupon Discount</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchChart.map((data, index) => (
                    <tr key={index}>
                      <td className='text-center'>{data.total_price}</td>
                      <td className='text-center'>{data.total_selling_price}</td>
                      <td className='text-center'>{data.total_coupon_amount}</td>
                      <td className='text-center'>{data.total_selling_price - data.total_price - data.total_coupon_amount}</td>
                    </tr>
                  ))}
                </tbody>
                <caption>*All values in Rupees</caption>
              </table>
            </div>


            <div className="tableDiv">
                  <table className='border'>
                    <tr>
                      <th className='px-3'>Products</th>
                      <th className='px-3'>Stock Sold</th>
                      <th className='px-3'>Stock Remaining</th>
                    </tr>
            {
              productsSold.map((products) => (
                
                    <tr>
                      <td className='px-3 text-center' >{products.product_name}</td>
                      <td className='px-3 text-center' >{products.quantity_sold}</td>
                      <td className='px-3 text-center' >{products.current_stock_quantity}</td>
                    </tr>
                 
              ))
            } </table>
            </div>



            <div className="text-center my-5">
              <button className="btn btn-primary" onClick={downloadPdf}>
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export default ShopProfile;
