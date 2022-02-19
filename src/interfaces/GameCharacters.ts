import { BigNumber } from "ethers";

export interface IOpponent {
    name: string;
    imageURI: string;
    maxFunds: BigNumber;
    currentFunds: BigNumber;
    wagerSize: BigNumber;
}

export interface ICharacter {
    index: BigNumber;
    name: string;
    imageURI: string;
    maxFunds: BigNumber;
    currentFunds: BigNumber;
    wagerSize: BigNumber;
}