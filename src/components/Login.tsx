import React, { useState } from 'react';
import axios from 'axios';
import Hero from "../assets/hero.webp"
import Logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://34.101.145.49:3002/api/login', {
        username,
        password,
      });
      const loggedInToken = response.data.access_token;
      navigate("/dashboard");
      setToken(loggedInToken);
      onLogin(token);


    } catch (error) {
      console.log('An error occurred during login:', error);
    }
  };



  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
      <div className='hidden sm:block  '>

        <img className='w-full h-full object-cover ' src={Hero} alt='' />

      </div>

      <div className='bg-gray-800 flex flex-col justify-center'>
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8' onSubmit={handleLogin}>
          <div className='mb-8 flex justify-center'>
            <img className='w-80' src={Logo} alt='' />
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
          <button onClick={handleLogin} className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>
            SIGNIN
          </button>
        </form>

      </div>
    </div>
  );
}
