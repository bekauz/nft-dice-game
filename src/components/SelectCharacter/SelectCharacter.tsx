import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { Contract, ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import gameABI from "./../../utils/Game.json";
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

declare var window: any

const SelectCharacter = ({ setCharacterNFT }) => {

  const [availableCharacters, setAvailableCharacters] = useState<any[]>([]);
  const [gameContract, setGameContract] = useState<Contract | null>(null);
  const [mintingCharacter, setMintingCharacter] = useState<boolean>(false);

  const mintCharacterNFT = (charId: number) => async () => {
    if (gameContract) {
      console.log("Minting character:");
      try {
        setMintingCharacter(true);
        const mintTxn = await gameContract.mintCharacterNFT(charId);
        await mintTxn.wait();
        console.log("transaction minted: ", mintTxn);
      } catch(err) {
        console.warn("Mint error:", err);
      } finally {
        setMintingCharacter(false);
      }
    } else {
      console.log("No contract available");
    }
  };

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

    const onCharacterMintEvent = async (tokenId: string, name: string) => {
      console.log(`Character NFT ${name} successfully with tokenId: ${tokenId}`);
      console.log(`See it on openSea: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`);
      if (gameContract) {
        const userCharacterNFT = await gameContract.getUserNFT();
        console.log("User owns character nft: ", userCharacterNFT);
        setCharacterNFT(transformCharacterData(userCharacterNFT));
      }
    };

    // if hook triggered and gameContract is nonnull, get characters
    if (gameContract) {
      getCharacters();
      gameContract.on('CharacterMint', onCharacterMintEvent);
    }

    return () => {
      // disable listener upon component unmount
      if (gameContract) {
        gameContract.off('CharacterMint', onCharacterMintEvent);
      }
    };
  }, [gameContract]);

  const renderCharacterSelection = () => (
    availableCharacters.map(
      (character, index) => (
        <div className="character-selection-box">
          <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name}></img>
          <h4>{character.name}</h4>
          <ul className="character-attributes">
            <li>Wager size: {character.wagerSize}</li>
            <li>Starting funds: {character.maxFunds}</li>
          </ul>
          <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFT(index)}
          >Mint {character.name}</button>
        </div>
    ))
  );

  return (
    <div className="select-character-container">
      {mintingCharacter
          ? <div className="loading">
              <div className="indicator">
                <LoadingIndicator />
                <p>Minting a character..</p>
              </div>
            </div>
          : <div>
              <h2>Select your character:</h2>
              <div className="character-mint-options">
                {availableCharacters.length > 0 && renderCharacterSelection()}
              </div>
            </div>
      }
    </div>
  );
};
 
export default SelectCharacter;