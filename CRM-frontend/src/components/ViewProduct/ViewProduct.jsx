import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

function ViewProduct() {
  const { id } = useParams()
  console.log(id)
  const [productData, setProductData] = useState([])
  const [feedbackData, setFeedbackData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState()


  useEffect(() => {
    const fetchProductData = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(`http://127.0.0.1:8000/shop_app/products/${id}`, {
          headers: {
            Authorization: `token ${token}`
          }
        })
        // alert('successfully fetched')
        console.log(response)
        localStorage.setItem('product_name', response.data.data.product_name)
        setProductData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProductData()


    const fetchFeedback = async () => {
      const token = localStorage.getItem('token')
      setIsLoading(true)
      try {
        const response = await axios.get('http://127.0.0.1:8000/shop_app/fetch_google_form_responses/',
          {
            headers: {
              Authorization: `token ${token}`
            }
          })
        const filteredFeedback = response.data.responses.filter((data) => data.product_name.toLowerCase() === localStorage.getItem('product_name').toLowerCase() && data.shop_name.toLowerCase() === localStorage.getItem('shop_name').toLowerCase())
        setFeedbackData(filteredFeedback)
        console.log('filtered', filteredFeedback)
        setIsLoading(false)

        console.log('feedback', response.data.responses)
      } catch (error) {
        console.log(error)
      }
    }
    fetchFeedback()
  }, [])

  console.log(feedbackData)

  useEffect(() => {
    console.log(feedbackData)
  }, [feedbackData])


  useEffect(() => {
    const fetchAnalysis = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(`http://127.0.0.1:8000/shop_app/products/${id}`, {
          headers: {
            Authorization: `token ${token}`
          }
        })

        setAnalysisData(response.data.data.sentimental_count)
        console.log('analysis', response.data.data.sentimental_count)
      } catch (error) {
        console.log(error)
        alert(error)
      }

    }
    fetchAnalysis()

  }, [])

  const getSentimentEmoji = (sentimentData) => {
    if (!sentimentData) return null;

    const { positive, negative, neutral } = sentimentData;

    if (positive > negative && positive > neutral) {
      return "😍"; // Laughing Emoji
    } else if (neutral > negative && neutral > positive) {
      return "🙂"; // Smiling Emoji
    } else if (negative > positive && negative > neutral) {
      return "😢"; // Sad Emoji
    } else {
      return null; // No dominant sentiment
    }
  };


  return (
    <>

      <div className='container-fluid'>
        <div className='row d-flex  align-items-center'>
          <div className='col-lg-1'></div>
          <div className='col-lg-4'>
            <img height={'300px'} className='img-fluid' src={`http://127.0.0.1:8000${productData.image}`} alt="img" />
          </div>
          <div className='col-lg-1'></div>
          <div className='col-lg-6'>
            <h3>{productData.product_name}</h3>
            <p>Company Name: {productData.pro_company}</p>
            <p>{productData.description}</p>
            <p>Price: {productData.selling_price}</p>
          </div>
        </div>
      </div>



      {/* Sentimental analysis */}
      <div className='text-center mt-4'>
        <h6 className='text-center'><b>What our customers thought about this product</b></h6>
        {analysisData && (
          <p>{getSentimentEmoji(analysisData)}</p>
        )}
      </div>

     {/* Sentiment counts */}
<div className="progress-bar rounded d-flex justify-content-center align-items-center">
  {analysisData && (
    <>
      {/* <div className='d-flex align-items-center gap-3'>
        <p className='mb-0'>Positive</p>
        <progress value={analysisData.positive || 0} max={200} />
        <p className='mb-0'>{analysisData.positive}</p>
      </div>
      <div className='d-flex align-items-center gap-3'>
        <p className='mb-0'>Neutral</p>
        <progress value={analysisData.neutral || 0} max={200} />
        <p className='mb-0'>{analysisData.neutral}</p>
      </div>
      <div className='d-flex align-items-center gap-3'>
        <p className='mb-0'>Negative</p>
        <progress value={analysisData.negative || 0} max={200} />
        <p className='mb-0'>{analysisData.negative}</p>
      </div> */}

      <table className='col-3' style={{backgroundColor: "white"}}>
        <tr>
          <td>Positive:</td>
          <td><progress value={analysisData.positive || 0} max={analysisData.positive + analysisData.neutral +analysisData.negative} /></td>
          <td className='d-flex justify-content-start '>{analysisData.positive}</td>
        </tr>
        <tr style={{backgroundColor: "white"}}>
          <td>Neutral:</td>
          <td><progress value={analysisData.neutral || 0} max={analysisData.positive + analysisData.neutral +analysisData.negative} /></td>
          <td className='d-flex justify-content-start '>{analysisData.neutral}</td>
        </tr>
        <tr>
          <td>Negative:</td>
          <td><progress value={analysisData.negative || 0} max={analysisData.positive + analysisData.neutral +analysisData.negative} /></td>
          <td className='d-flex justify-content-start '>{analysisData.negative}</td>
        </tr>
        
      </table>
    </>
  )}
</div>
      <h3 className='text-center mt-5 text-dark'>Comments</h3>

      {
        isLoading ? <p className='text-center'>Data Loading...</p> :

          feedbackData.length > 0 ? (
            <div className='wrapper my-3 d-flex flex-column align-items-center justify-content-center'>
              {
                feedbackData.map((data, index) => (
                  <>
                    <div className=' border rounded shadow  w-50 px-5 py-3 d-flex flex-column justify-content-center' key={index}>
                      <p className=' mb-1 fs-3 fw-bold '>{data.customer_name}</p>
                      <p className=' mb-0 '>{data.feedback}</p>
                    </div>
                  </>
                ))
              }
            </div>
          ) :
            <p className='text-center'>No Comments for this product...</p>
      }
    </>
    
  )
}

export default ViewProduct