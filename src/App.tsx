import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';

function App() {
  const [token, setToken] = useState<string>('');

  const handleLogin = (token: string) => {
    setToken(token);
  };

  return (
    <>
      {token ? (
        <>
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/master-data" element={<MasterData  />} />
          </Routes>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
