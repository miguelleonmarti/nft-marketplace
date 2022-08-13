import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("Marketplace");
  const contract = await Contract.deploy();
  const { address } = await contract.deployed();

  console.log(`Marketplace contract deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
