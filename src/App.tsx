import { useState } from 'react';

import Login from "./components/Login"
import Dashboard from './pages/Dashboard';

function App() {

  const [token, setToken] = useState<string>('');

  const handleLogin = (token: string) => {
    setToken(token);
  };
  return (
    <>
     {token ? (<><Dashboard/></>) : ( <Login onLogin={handleLogin}/>)}
   
    </>
  )
}

export default App
