import React, { useEffect, useRef, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import axios from 'axios';
import { TiTick } from "react-icons/ti";



function ServiceRequests() {

  const [fetchServiceRequests, setfetchServiceRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const fetchServiceResponse = async () => {
    const token = localStorage.getItem('token');
    const shop_name = localStorage.getItem('shop_name')
    try {
      setIsLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/shop_app/service-form-responses/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const filteredData = response.data.data.filter(data => data.shopname === shop_name);

      const serviceRequests = filteredData.map(request => ({
        ...request,
        verified: localStorage.getItem(`verified_${request.id}`) === 'true',
      }));
      // const filteredData = serviceRequests.filter((data) => {
      //   data.map ((datas) => {
      //     datas.shopname === 'Edison'
      //   })
      // })


      console.log(filteredData)
      setfetchServiceRequests(serviceRequests);
      console.log(response)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  const handleTick = async (id) => {
    console.log('inside handleTick function');
    try {
      const updatedServiceRequests = fetchServiceRequests.map(request => {
        if (request.id === id) {
          localStorage.setItem(`verified_${id}`, 'true'); // Store verification status in local storage
          return { ...request, verified: true };
        }
        return request;
      });
      setfetchServiceRequests(updatedServiceRequests);
      await verifiedStatus(id); // Call verifiedStatus with the response
    } catch (error) {
      console.log(error);
    }
  };

  const verifiedStatus = async (id) => {
    console.log('inside verifiedStatus');
    try {
      const postedResponse = await axios.post(
        `http://127.0.0.1:8000/shop_app/sevice-verify/`,
        {
          response: id,
          is_done: true,
        }
      );
      console.log(postedResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServiceResponse()
  }, [])

  return (
    <>
      <h1 className='text-center'>Service Requests</h1>
      {
        isLoading ? <p className='text-center'>Loading Data... Please Wait...</p> :
          (
            fetchServiceRequests.length > 0 ? (
              <div className='container w-75'>
              {
                fetchServiceRequests.map((data) => (
                  <Accordion className='mb-1' key={data.id}>
                    <AccordionSummary
                      expandIcon={<GridExpandMoreIcon />}
                      aria-controls="panel3-content"
                      id="panel3-header"
                    >
                      Customer Name: {data.customername} &emsp; &emsp;  Service for: {data.productname} &emsp; &emsp; Shop Name: {data.shopname}
                    </AccordionSummary>

                    <AccordionDetails>
                      Description: {data.issue_or_service}
                      <p>
                        Contact: {data.mobile}
                      </p>
                    </AccordionDetails>
                    <AccordionActions>
                      {data.verified ?
                        <div className='verifiedBox d-flex justify-content-center align-content-center'><p className='text-success p-0'>Verified</p><TiTick color='green' className='mt-1' /></div> : (
                          <Button className=' mb-2 me-5' onClick={() => handleTick(data.id)}>
                            <i className="fa-solid fa-xl fa-check py-2"></i>
                          </Button>
                        )}
                    </AccordionActions>
                  </Accordion>
                ))
              }
            </div>
            ) : 
            <p className='text-center'>No service requests...</p>
          )
      }
    </>
  )
}

export default ServiceRequests
