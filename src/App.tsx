import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from "./components/SelectCharacter/SelectCharacter";
import { BigNumber, Contract, ethers } from "ethers";
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import gameABI from "./utils/TrulyRandomGame.json";
import GameTable from './components/GameTable/GameTable';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import { ICharacter } from './interfaces/GameCharacters';

declare var window: any


function App() {

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [characterNFT, setCharacterNFT] = useState<ICharacter>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    networkCheck();
    checkWalletConnection();
  }, []);

  const checkWalletConnection =  async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("no wallet found");
        setIsLoading(false);
        return;
      } else {
        console.log("ethereum object: ", ethereum);
        // Web3 provider injected as window.ethereum into each page by Metamask 
        const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        // request permission to connect user accounts
        const accounts: any[] = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log("No account found.");
        }
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
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
    if (isLoading) {
      return <LoadingIndicator />
    }
    if (!currentAccount) {
      console.log("no authenticated account found");
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
      console.log("authenticated with no nft");
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else {
      return (
        <GameTable characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}></GameTable>
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

  useEffect(() => {
    const fetchUserNFT = async () => {
      const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer: JsonRpcSigner = provider.getSigner();
      const gameContract: Contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        gameABI.abi,
        signer
      );
  
      const userNFT = await gameContract.getUserNFT();
      if (userNFT.name) {
        console.log(`Found ${userNFT.name} character for user`);
        let transformedUserNFT: any = transformCharacterData(userNFT); 
        setCharacterNFT(transformedUserNFT);
      } else {
        console.log('No character found');
      }
      // once everything is loaded, disable loading state
      setIsLoading(false);
    };

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
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
