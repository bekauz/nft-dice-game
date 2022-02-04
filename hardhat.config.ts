import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import * as dotenv from 'dotenv';
dotenv.config();

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  // networks: {
  //   rinkeby: {
  //     url: process.env.INFURA_API_URL,
  //     accounts: [ process.env.PRIVATE_KEY ],
  //   },
  // },
};
