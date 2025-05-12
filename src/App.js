import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Home from './components/Home';
import Stats from './components/Stats';
import Invite from './components/Invite';
import Earn from './components/Earn';
import Wallet from './components/Wallet';
import TabBar from './components/TabBar';

const TAB_COMPONENTS = {
  Home,
  Stats,
  Invite,
  Earn,
  Wallet,
};

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedLang, setSelectedLang] = useState({ code: 'en', label: 'English', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg' });
  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <div className="pb-16 min-h-screen">
        {activeTab === 'Home' && <Home selectedLang={selectedLang} setSelectedLang={setSelectedLang} />}
        {activeTab === 'Stats' && <Stats selectedLang={selectedLang} setSelectedLang={setSelectedLang} />}
        {activeTab === 'Invite' && <Invite selectedLang={selectedLang} setSelectedLang={setSelectedLang} />}
        {activeTab === 'Earn' && <Earn selectedLang={selectedLang} setSelectedLang={setSelectedLang} />}
        {activeTab === 'Wallet' && <Wallet selectedLang={selectedLang} setSelectedLang={setSelectedLang} />}
        <TabBar active={activeTab} onChange={setActiveTab} selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
      </div>
    </TonConnectUIProvider>
  );
}


export default App;
