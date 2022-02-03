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

    let playerPreRoll = await gameContract.characterMetadata(playerNftId);
    let opponentPreRoll = await gameContract.opponent();

    txn = await gameContract.rollTheDice();
    txn.wait();

    let playerAfterRoll = await gameContract.characterMetadata(playerNftId);
    let opponentAfterRoll = await gameContract.opponent();

    if (
      BigNumber.from(playerAfterRoll.currentFunds).lt(playerAfterRoll.maxFunds)
    ) {
      // player lost the roll
      expect(playerAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(playerPreRoll.maxFunds).sub(playerPreRoll.wagerSize));
      expect(opponentAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(opponentPreRoll.maxFunds).add(playerPreRoll.wagerSize));
    } else {
      // opponent lost the roll  
      expect(opponentAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(opponentPreRoll.maxFunds).sub(opponentPreRoll.wagerSize));
      expect(playerAfterRoll.currentFunds).to.be
        .equal(BigNumber.from(playerAfterRoll.maxFunds).add(opponentPreRoll.wagerSize));
    }
  });

  it(
    "Should roll the dice and nullify the balance given insufficient funds but more than 0", async function () {
    // redeploy contract with insufficient funds
    gameContract = await gameContractFactory.deploy(
        ["test-1", "test-2", "test-3"],
        [
            "https://i.imgur.com/aodcS9h.jpeg",
            "https://i.imgur.com/rBw3HgN.jpeg",
            "https://i.imgur.com/xIHzkoA.jpeg"
        ],
        [10, 10, 10],
        [12, 20, 30],
        "test-4",
        "https://i.imgur.com/TcIFNT0.jpeg",
        30,
        40
    );
    await gameContract.deployed();

    let txn;
    txn = await gameContract.connect(owner).mintCharacterNFT(1);
    txn.wait();

    const playerNftId = await gameContract.ownerCharacterIds(owner.address);

    let playerPreRoll = await gameContract.characterMetadata(playerNftId);
    let opponentPreRoll = await gameContract.opponent();
    txn = await gameContract.rollTheDice();
    txn.wait();
    let playerAfterRoll = await gameContract.characterMetadata(playerNftId);
    let opponentAfterRoll = await gameContract.opponent();

    if (BigNumber.from(playerAfterRoll.currentFunds).lt(playerAfterRoll.maxFunds)) {
      // player lost the roll
      expect(BigNumber.from(playerAfterRoll.currentFunds).isZero());
      expect(BigNumber.from(opponentAfterRoll.currentFunds)).to.be
        .equal(BigNumber.from(opponentPreRoll.currentFunds).add(playerPreRoll.currentFunds));
    } else {
      // opponent lost the roll  
      expect(BigNumber.from(opponentAfterRoll.currentFunds).isZero());
      expect(BigNumber.from(playerAfterRoll.currentFunds)).to.be
        .equal(BigNumber.from(playerPreRoll.currentFunds).add(opponentPreRoll.currentFunds));
    }
  });
});