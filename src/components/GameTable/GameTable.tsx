import { BigNumber, Contract, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './GameTable.css';
import gameABI from "./../../utils/TrulyRandomGame.json";
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import { ICharacter, IOpponent } from '../../interfaces/GameCharacters';

declare var window: any

const GameTable = ({ characterNFT, setCharacterNFT }) => {

    const [gameContract, setGameContract] = useState<Contract | null>(null);
    const [opponent, setOpponent] = useState<IOpponent>({
        currentFunds: BigNumber.from(0),
        maxFunds: BigNumber.from(0),
        name: '',
        imageURI: '',
        wagerSize: BigNumber.from(0)
    });
    const [gameState, setGameState] = useState<string>('');
    
    useEffect(() => {

        const fetchOpponent = async () => {
            const opponentTxn = await gameContract?.getOpponent();
            console.log("Opponent: ", opponentTxn);
            setOpponent(transformCharacterData(opponentTxn));
        };

        const onDiceRollResult = (
            playerRoll: BigNumber,
            opponentRoll: BigNumber,
            playerFunds: BigNumber,
            opponentFunds: BigNumber
        ) => {
            console.log(`Player roll: ${playerRoll}, opponent: ${opponentRoll}`);
            console.log(`player balance: ${playerFunds}, opponent: ${opponentFunds}`);
            // update funds
            setCharacterNFT((previous: ICharacter) => ({...previous, currentFunds: playerFunds}));
            setOpponent((previous: IOpponent) => ({...previous, currentFunds: opponentFunds}));
        };

        const onDiceRolled = (
            requestId: any,
            address: any,
        ) => {
            console.log(`Player ${address} rolled the dice with requestId ${requestId}`);
        }

        const onDiceLanded = (
            requestId: any,
            result: BigNumber
        ) => {
            console.log(`Dice landed: ${result}`);
            console.log(`requestId: ${requestId}`);
            setGameState('');
        };
        
        if (gameContract) {
            fetchOpponent()
            gameContract.on('DiceRollResult', onDiceRollResult);
            gameContract.on('DiceRolled', onDiceRolled);
            gameContract.on('DiceLanded', onDiceLanded);
        }

        return () => {
            if (gameContract) {
                gameContract.off('DiceRollResult', onDiceRollResult);
            }
        };
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
    }, []);

    function renderProgressBar(player: any) {
        if (player.currentFunds > player.maxFunds) {
            return (
                <progress value={player.maxFunds} max={player.currentFunds} />
            );
        } else {
            return (
                <progress value={player.currentFunds} max={player.maxFunds} />
            );
        }
    }

    const rollTheDice = async () => {
        try {
            if (gameContract) {
                setGameState('rolling');
                console.log("rolling the dice");
                let txn = await gameContract.rollTheDice();
                await txn.wait();
            }
        } catch (err) {
            console.log("Game contract not available.");
        }
    };
     
    return (    
        <div className="game-table">
            {opponent && (
                <div className={`opponent-container ${gameState}`}>
                    <h2>Opponent {opponent.name}</h2>
                    <div className="image-content">
                        <img 
                            src={`https://cloudflare-ipfs.com/ipfs/${opponent.imageURI}`}
                            alt={`Opponent ${opponent.name}`} />
                        <div className="funds-bar">
                        {renderProgressBar(opponent)}
                        <p>{`${opponent.currentFunds} / ${opponent.maxFunds} `}</p>
                        </div>
                    </div>
                    <div className="play-container">
                        <button className="cta-button" onClick={rollTheDice}>
                            {`Roll the dice against ${opponent.name}`}
                        </button>
                    </div>
                    {gameState == 'rolling' && (
                        <div className="loading-indicator">
                            <LoadingIndicator />
                            <p>Rolling..</p>
                        </div>
                    )}
                </div>
            )}

            {characterNFT && (
                <div className="player-container">
                    <h4>{characterNFT.name}</h4>
                    <div className="image-content">
                        <img 
                            src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                            alt={`Player ${characterNFT.name}`} />
                        <div className="funds-bar">
                        {renderProgressBar(characterNFT)}
                        <p>{`${characterNFT.currentFunds} / ${characterNFT.maxFunds} `}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameTable;