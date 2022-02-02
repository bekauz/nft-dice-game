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
            "https://i.imgur.com/aodcS9h.jpeg",
            "https://i.imgur.com/rBw3HgN.jpeg",
            "https://i.imgur.com/xIHzkoA.jpeg"
        ], // imgURIs
        [100, 110, 120], // initial funds
        [12, 20, 30], // wager sizes
        "test-4",
        "https://i.imgur.com/TcIFNT0.jpeg",
        1500,
        40,
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let txn = await gameContract.mintCharacterNFT(1);
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