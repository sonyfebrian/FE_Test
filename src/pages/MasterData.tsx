import React from 'react';

import NavBar from '../components/Navbar'
import Tabel from '../components/Tabel'
interface DashboardProps {

  onLogout: () => void;
}

const MasterData: React.FC<DashboardProps> = ({ onLogout }) => {

  return (
    <><NavBar onLogout={onLogout} />
      <Tabel />
    </>
  )
}

export default MasterData;
