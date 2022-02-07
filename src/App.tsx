import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from "./components/SelectCharacter/SelectCharacter";
import { Contract, ethers } from "ethers";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import gameABI from "./utils/Game.json";


declare var window: any

function App() {

  const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined);
  const [characterNFT, setCharacterNFT] = useState({});

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

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("No Metamask found");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Connected: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const renderContent = () => {
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button 
            className="cta-button connect-wallet-button" 
            onClick={ connectWallet }
          >
            Connect the wallet on Rinkeby to play
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else {
      return (
        <div></div>
      );
    }
  };

  const networkCheck = async () => {
    try {
      // 4 = rinkeby chain id
      if (window.ethereum.networkVersion !== '4') {
        alert("Change you network to Rinkeby to use the dapp");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserNFT = async () => {

    const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer: JsonRpcSigner = provider.getSigner();
    
    const gameContract: Contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      gameABI.abi,
      signer
    );

    const txn = await gameContract.getUserNFT();
    if (txn.name) {
      console.log(`Found ${txn.name} character for user`);
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log('No character found');
    }
  };


  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {

    fetchUserNFT();

    if (currentAccount) {
      console.log(`Authenticated with ${currentAccount}`);
      fetchUserNFT();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="data-container">
        <div className="header-container">
          <p className="header">Dice game</p>
          <p className="sub-header">Connect the wallet on Rinkeby to play</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
