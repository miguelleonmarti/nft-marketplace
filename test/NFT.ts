import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT", function () {
  const TOKEN_NAME = "Github NFT";
  const TOKEN_SYMBOL = "GH";
  const MAX_SUPPLY = 3;

  async function deploy() {
    const GithubToken = await ethers.getContractFactory("NFT");
    const githubToken = await GithubToken.deploy(TOKEN_NAME, TOKEN_SYMBOL);
    const [owner, ...otherAccounts] = await ethers.getSigners();
    await githubToken.deployed();
    return { githubToken, owner, otherAccounts };
  }

  describe("Deployment", function () {
    it("Should set the name and symbol of the token", async function () {
      const { githubToken } = await deploy();
      expect(await githubToken.name()).to.equal(TOKEN_NAME);
      expect(await githubToken.symbol()).to.equal(TOKEN_SYMBOL);
    });
    it("Should be no tokens yet", async function () {
      const { githubToken } = await deploy();
      expect(await githubToken.totalSupply()).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("Should mint all the tokens", async function () {
      const { githubToken, owner } = await deploy();
      await githubToken.mint(owner.address);
      await githubToken.mint(owner.address);
      await githubToken.mint(owner.address);
      expect(await githubToken.totalSupply()).to.equal(MAX_SUPPLY);
      expect(await githubToken.balanceOf(owner.address)).to.equal(MAX_SUPPLY);
    });
  });
});
