import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './GameTable.css';
import gameABI from "./../../utils/Game.json";
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

declare var window: any

const GameTable = ({ characterNFT }) => {

    const [gameContract, setGameContract] = useState<Contract | null>(null);
    const [opponent, setOpponent] = useState<any>(null);
    
    useEffect(() => {

        const fetchOpponent = async () => {
            const opponentTxn = await gameContract?.getOpponent();
            console.log("Opponent: ", opponentTxn);
            setOpponent(transformCharacterData(opponentTxn));

        };

        if (gameContract) {
            fetchOpponent();
        }
    }, [gameContract]);

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
    });

    function renderProgressBar() {
        if (opponent.currentFunds > opponent.maxFunds) {
            return (
                <progress value={opponent.maxFunds} max={opponent.currentFunds} />
            );
        } else {
            return (
                <progress value={opponent.currentFunds} max={opponent.maxFunds} />
            );
        }
    }

    const rollTheDice = async () => {
        
    };
     
    return (
        <div className="game-table">
            {opponent && (
                <div className="opponent-container">
                    <h2>{opponent.name}</h2>
                    <div className="image-content">
                        <img 
                            src={opponent.imageURI} 
                            alt={`Opponent ${opponent.name}`} />
                        <div className="funds-bar">
                        {renderProgressBar()}
                        <p>{`${opponent.currentFunds} / ${opponent.maxFunds} `}</p>
                        </div>
                    </div>
                    <div className="play-container">
                        <button className="cta-button" onClick={rollTheDice}>
                            {`Roll the dice`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameTable;