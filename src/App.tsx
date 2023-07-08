import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from './pages/Dashboard';
import MasterData from './pages/MasterData';

function App() {

  const tokens = localStorage.getItem('token');

  const [token, setToken] = useState(tokens);



  const handleLogin = (token: string) => {

    setToken(token);
  };

  const handleLogout = () => {

    localStorage.removeItem('token');
  };


  return (
    <>


      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard onLogout={handleLogout} />

            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="/master-data" element={
          token ? (
            <MasterData onLogout={handleLogout} />

          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>




    </>
  );
}

export default App;
