import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, ContractFactory, Signer } from "ethers";
import { assert } from "console";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("Game contract", function () {

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  let gameContractFactory: ContractFactory;
  let gameContract: Contract;

  beforeEach(async function () {

    [owner, addr1, addr2] = await ethers.getSigners();
    gameContractFactory = await ethers.getContractFactory('Game');
    gameContract = await gameContractFactory.deploy(
        ["test-1", "test-2", "test-3"], // names
        [
            "https://i.imgur.com/aodcS9h.jpeg",
            "https://i.imgur.com/rBw3HgN.jpeg",
            "https://i.imgur.com/xIHzkoA.jpeg"
        ], // imgURIs
        [100, 110, 120], // initial funds
        [12, 20, 30], // wager sizes
        "test-4",
        "https://i.imgur.com/TcIFNT0.jpeg",
        1500,
        40
    );
    await gameContract.deployed();
  });

  it("Should allow a user to mint a character", async function () {

    expect(await gameContract.connect(owner).mintCharacterNFT(1))
      .to.emit(gameContract, "CharacterMint").withArgs(1, "test-2");
    expect(await gameContract.ownerCharacterIds(owner.address)).to.equal(1);
    const mintedTokenMetadata = await gameContract.characterMetadata(1);
    expect(mintedTokenMetadata.name).to.equal("test-2");
    expect(mintedTokenMetadata.currentFunds).to.equal(110);
    expect(mintedTokenMetadata.maxFunds).to.equal(110);
    expect(mintedTokenMetadata.wagerSize).to.equal(20);
  });

  it("Should generate tokenURI", async function () {
    await gameContract.connect(owner).mintCharacterNFT(1);
    let generatedTokenURI = await gameContract.tokenURI(0);
    const b64Metadata: String = "data:application/json;base64";
    expect(generatedTokenURI.startsWith(b64Metadata)).to.be.true;
    expect(generatedTokenURI.length > b64Metadata.length).to.be.true;
  });

  it("Should roll the dice and deduct the wager given sufficient funds", async function () {
    
    let txn;
    txn = await gameContract.connect(owner).mintCharacterNFT(1);
    txn.wait();

    const playerNftId = await gameContract.ownerCharacterIds(owner.address);

    let playerNft = await gameContract.characterMetadata(playerNftId);
    let opponent = await gameContract.opponent();

    txn = await gameContract.rollTheDice();
    txn.wait();

    let playerNftAfterRoll = await gameContract.characterMetadata(playerNftId);
    let opponentAfterRoll = await gameContract.opponent();

    if (
      BigNumber.from(playerNftAfterRoll.currentFunds).lt(playerNftAfterRoll.maxFunds)
    ) {
      // player lost the roll
      expect(playerNftAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(playerNft.maxFunds).sub(playerNft.wagerSize));
      expect(opponentAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(opponent.maxFunds).add(playerNft.wagerSize));
    } else {
      // opponent lost the roll  
      expect(opponentAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(opponent.maxFunds).sub(opponent.wagerSize));
      expect(playerNftAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(playerNftAfterRoll.maxFunds).add(opponent.wagerSize));
    }
  });
});