import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { run, ethers } from "hardhat"

async function main() {
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    [owner, addr1, addr2] = await ethers.getSigners();

    const gameContractFactory = await ethers.getContractFactory('Game');
    const gameContract = await gameContractFactory.deploy(
        ["test-1", "test-2", "test-3"], // names
        [
          "QmPTQtjpgcfMB2jPmajV4LcfEEbUYRh9omABu5F2zLTMia?filename=character-1.jpeg",
          "QmcHDikSuFjq5TzfUXzB5v1w3A84qEwSEyzKvbRQqVL7mm?filename=character-2.jpeg",
          "Qmbmw632uXTXfWv2HXtUo2DbhotLjuui8hsKSLvAi7bns8?filename=character-3.jpeg"
        ], // imgURIs
        [100, 1, 120], // initial funds
        [12, 10, 30], // wager sizes
        "test-4",
        "QmU1y5T85WSmZ8svP1QbVZJfTeVFtEt1c18jetbNXrumJ2",
        1500,
        40,
    );

    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let txn = await gameContract.mintCharacterNFT(1);
    await txn.wait();
    txn = await gameContract.rollTheDice();
    await txn.wait();
    txn = await gameContract.rollTheDice();
    await txn.wait();
    txn = await gameContract.rollTheDice();
    await txn.wait();
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });