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
        [100, 125, 120], // initial funds
        [50, 30, 10], // wager sizes
        "test-4",
        "https://i.imgur.com/TcIFNT0.jpeg",
        1500,
        70,
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });