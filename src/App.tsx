import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';

declare var window: any

function App() {

  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined);

  const checkWalletConnection =  async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("no wallet found");
        return;
      } else {
        console.log("ethereum object: ", ethereum);
        // Web3 provider injected as window.ethereum into each page by Metamask 
        const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        // request permission to connect user accounts
        const accounts: any[] = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          const account: string = accounts[0];
          console.log('Found an authorized account:', account, typeof account);
          setCurrentAccount(account);
        } else {
          console.log("No account found.");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
