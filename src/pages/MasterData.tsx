import React from 'react';

import NavBar from '../components/Navbar'
import Tabel from '../components/Tabel'
interface TokenProps {
  token: string;
}

const MasterData: React.FC<TokenProps> = ({ token }) => {

  return (
    <><NavBar token={token} />
      <Tabel token={token} />
    </>
  )
}

export default MasterData;
