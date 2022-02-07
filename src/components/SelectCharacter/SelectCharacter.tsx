import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { Contract, ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import gameABI from "./../../utils/Game.json";

declare var window: any

const SelectCharacter = ({ setCharacterNFT }) => {

  const [availableCharacters, setAvailableCharacters] = useState(null);
  const [gameContract, setGameContract] = useState<Contract | undefined>(undefined);

  useEffect(() => {
    const { ethereum } = window;
  
    if (ethereum) {
      const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer: JsonRpcSigner = provider.getSigner();
      
      const contract: Contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        gameABI.abi,
        signer
      );
      console.log("game contract address: ", contract.address);
      setGameContract(contract);
    } else {
    console.log("No eth object found");
    }
  }, []);

  useEffect(() => {
    
    const getCharacters = async () => {

      console.log("Getting characters to mint...");

      const charactersTxn = await gameContract?.getDefaultCharacterTraits();
      
      const availableCharacters = charactersTxn.map(
        (charData) => transformCharacterData(charData)
      );
      console.log("available characters: ", availableCharacters);
      setAvailableCharacters(availableCharacters);
    };

    // if hook triggered and gameContract is nonnull, get characters
    if (gameContract) {
      getCharacters();
    }
  }, [gameContract]);

  return (
    <div className="select-character-container">
      <h2>Select your character:</h2>
    </div>
  );
};
 
export default SelectCharacter;
