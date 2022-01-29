import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";


describe("Game contract", function () {
  it("Should deploy the contract ", async function () {
    const GameFactory = await ethers.getContractFactory("Game");
    const game = await GameFactory.deploy();
    await game.deployed();
    
  });
});
