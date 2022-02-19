# dice game

This is a practice project built using React & Solidity.

Chainlink oracle is utilized to obtain random numbers from off-chain.

IPFS (Pinata) is used to store and retrieve media for the character metadata (ERC721).

## gameplay 

After connecting with their wallet on Rinkeby network users can mint a character with different traits.

Then user is able to roll the dice; this takes a while because of the Request and Receive cycle of Chainlink and how the callback function is executed.

## local setup

1. `npm install` at the root of your directory
2. `npm start`/`yarn start` to start the project


