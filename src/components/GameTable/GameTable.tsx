import { Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './GameTable.css';
import gameABI from "./../../utils/Game.json";
import { CONTRACT_ADDRESS } from '../../constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

declare var window: any

const GameTable = ({ characterNFT }) => {

    const [gameContract, setGameContract] = useState<Contract | null>(null);

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

    return (
        <div className="game-table">
            
        </div>
    );
};
 
export default GameTable;