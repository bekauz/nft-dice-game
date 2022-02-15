import { ethers } from "hardhat"


async function main() {
    const gameContractFactory = await ethers.getContractFactory('Game');
    const gameContract = await gameContractFactory.deploy(
        ["test-1", "test-2", "test-3"], // names
        [
            "QmPTQtjpgcfMB2jPmajV4LcfEEbUYRh9omABu5F2zLTMia?filename=character-1.jpeg",
            "QmcHDikSuFjq5TzfUXzB5v1w3A84qEwSEyzKvbRQqVL7mm?filename=character-2.jpeg",
            "Qmbmw632uXTXfWv2HXtUo2DbhotLjuui8hsKSLvAi7bns8?filename=character-3.jpeg"
        ], // imgURIs
        [100, 125, 120], // initial funds
        [50, 30, 10], // wager sizes
        "test-4",
        "QmU1y5T85WSmZ8svP1QbVZJfTeVFtEt1c18jetbNXrumJ2",
        1500,
        70,
        "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B", // chainlink rinkeby vrf coordinator
        "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", // chainlink rinkeby LINK token address 
        // "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311", // chainlink rinkeby key hash
        0.1 // chainlink base fee
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