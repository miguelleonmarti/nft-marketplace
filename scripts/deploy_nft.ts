import { ethers } from "hardhat";

async function main() {
  const [TOKEN_NAME, TOKEN_SYMBOL] = ["Github NFT", "GH"];
  const Contract = await ethers.getContractFactory("NFT");
  const contract = await Contract.deploy(TOKEN_NAME, TOKEN_SYMBOL);
  const { address } = await contract.deployed();

  console.log(`NFT contract deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
