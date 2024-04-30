import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Login.css'
import Header from '../../common/header/Header.jsx'
import img from '../../../assets/pexels-rdne-stock-project-7563565 (1)-Photoroom-Photoroom.png-Photoroom.png'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [id, setId] = useState({})
  const navigate = useNavigate()
  const [requiredUsername, setRequiredUsername] = useState()
  const [requiredPassword, setRequiredPassword] = useState()

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Set fadeIn to true after component mounts
    setFadeIn(true);
  }, []);


  const handleKeyPress = (e) => {
    if (e.key === 'Enter'){
      handleLogin()
    }
  }

  const handleLogin = async () => {
    if (!username && !password) {
      setRequiredPassword('')
      setRequiredUsername('')
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter Both Credentials",
      });
      return;


    }
    else if (!password) {
      setRequiredUsername('')
      setRequiredPassword("Please enter your password")
      return; //to stop further execution of the function.

    }
    else if (!username) {
      setRequiredPassword("")
      setRequiredUsername('This field is Required')

      return
    }
    try {
      const response = await axios.post('http://localhost:8000/shop_app/login/', {
        username: username,
        password: password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', username);

      //setting id into the local storage.
      localStorage.setItem('id', response.data.data.id);
      // alert('Login Successful')
      Swal.fire({
        title: "Login Successful!",
        // text: "Redirecting to Home",
        icon: "success"
      });
      setTimeout(() => {
        navigate('/home')
      }, 1000)
      console.log(response);
    } catch (error) {
      setError('Invalid username or password');
      // console.error('Error logging in:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };


  return (
    <>
      <div className={`loginMidWrapper ${fadeIn ? 'fade-in' : ''}`}>
        <div className="p-5 pageBody">
          <div className="leftAndRightWrapper d-flex rounded">
            <div className="col-6 leftSide d-flex align-items-center">
              <div className="welcomeText text-center d-flex justify-content-center align-items-center flex-column">
                <h6 className='text-warning'>WELCOME BACK!</h6>
                <h2 className='text-danger'>Effortless Transactions, Instant Records, and Seamless Management Await. Let's Simplify Your Shop's Success!</h2>
              </div>
            </div>
            <div className="col-6 loginRight">
              <div className="loginBox col-8">
                <p>LOGIN</p>
                <label htmlFor="">Username</label>
                <input type="text" name="" className='form-control' value={username} onChange={(e) => setUsername(e.target.value)} />
                {
                  requiredUsername && <p className='errorMsg'>*{requiredUsername}</p>
                }
                <label htmlFor="" className='mt-3'>Password</label>
                <input type="password" name="" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress}/>
                {
                  requiredPassword && <p className='errorMsg'>*{requiredPassword}</p>
                }
                <button className='btn btn-success loginButton col-5' onClick={handleLogin}>
                  Login
                </button>

                <p className='mt-3'>New to our site? <Link to={'/register'}>Register Here..</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login