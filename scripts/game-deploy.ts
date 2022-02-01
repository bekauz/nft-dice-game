import { ethers } from "hardhat"

async function main() {
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
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let tokenId1 = await gameContract.mintCharacterNFT(0);
    let tokenId2 = await gameContract.mintCharacterNFT(1);
    let tokenId3 = await gameContract.mintCharacterNFT(2);
    let tokenId4 = await gameContract.mintCharacterNFT(1);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });