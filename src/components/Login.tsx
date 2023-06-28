import React, { useState } from 'react';
import axios from 'axios';
import LogoLogin from "../assets/login-logo.jpg"
import Logo from "../assets/logo.png"

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      onLogin(token);
      // Check if the login was successful
      if (response.status === 200) {
        // Redirect to the dashboard
        console.log('loginsukses');
       
  
      } else {
        // Handle login error
        console.log('Login failed');
      }
    } catch (error) {
      console.log('An error occurred during login:', error);
    }
  };

  const handleLogout = () => {
    // Perform any necessary logout actions
    // Redirect to the login page
    console.log('Login failed');
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block  '>
    
      <img className='w-full h-full object-cover ' src={LogoLogin} alt='' />
       
      </div>

      <div className='bg-gray-800 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8' onSubmit={handleLogin}>
          <div className='mb-8 flex justify-center'>
            <img className='w-80' src={Logo} alt=''  />
          </div>
          <h2 className='text-4xl dark:text-white font-bold text-center'>SIGN IN</h2>
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Username</label>
            <input
              className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col text-gray-400 py-2'>
            <label>Password</label>
            <input
              className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='flex justify-between text-gray-400 py-2'>
            <p className='flex items-center'>
              <input className='mr-2' type='checkbox' /> Remember Me
            </p>
            <p>Forgot Password</p>
          </div>
          <button className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>
            SIGNIN
          </button>
        </form>
        <button className='w-full my-5 py-2 bg-red-500 text-white font-semibold rounded-lg' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
