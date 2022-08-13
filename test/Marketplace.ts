import { expect } from "chai";
import { ethers } from "hardhat";
import { Marketplace, NFT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Marketplace", function () {
  let owner: SignerWithAddress;
  let otherAccounts: SignerWithAddress[];
  let nft: NFT;
  let marketplace: Marketplace;
  const tokenId = ethers.BigNumber.from(0);
  let listingId = ethers.BigNumber.from(1);
  const price = ethers.BigNumber.from(1000);

  async function deployNFT() {
    const [TOKEN_NAME, TOKEN_SYMBOL] = ["Github NFT", "GH"];
    const NFTContract = await ethers.getContractFactory("NFT");
    const nftContract = await NFTContract.deploy(TOKEN_NAME, TOKEN_SYMBOL);
    await nftContract.deployed();
    return nftContract;
  }

  async function deployMarketplace() {
    const MarketplaceContract = await ethers.getContractFactory("Marketplace");
    const marketplaceContract = await MarketplaceContract.deploy();
    await marketplaceContract.deployed();
    return marketplaceContract;
  }

  before(async () => {
    [owner, ...otherAccounts] = await ethers.getSigners();
  });

  describe("List token", function () {
    before(async () => {
      nft = await deployNFT();
      marketplace = await deployMarketplace();
      await nft.mint(owner.address);
    });

    it("Should prevent listing (contract not approved)", async function () {
      await expect(marketplace.listToken(nft.address, tokenId, price)).to.be.revertedWith("ERC721: caller is not token owner nor approved");
    });

    it("Should execute listing", async function () {
      await nft.approve(marketplace.address, tokenId);
      expect(await marketplace.listToken(nft.address, tokenId, price))
        .to.emit(marketplace, "Listed")
        .withArgs(listingId, owner, nft.address, tokenId, price);
      expect(await nft.ownerOf(tokenId)).equal(marketplace.address);
    });
  });

  describe("Buy token", function () {
    before(async () => {
      nft = await deployNFT();
      marketplace = await deployMarketplace();
      await nft.mint(owner.address);
      await nft.approve(marketplace.address, tokenId);
      await marketplace.listToken(nft.address, tokenId, price);
    });

    it("Should prevent sale (seller cannot be buyer)", async function () {
      await expect(marketplace.buyToken(listingId)).to.be.revertedWith("Seller cannot be buyer");
    });

    it("Should execute sale", async function () {
      expect(await marketplace.connect(otherAccounts[0]).buyToken(listingId, { value: price }))
        .to.emit(marketplace, "Sale")
        .withArgs(listingId, otherAccounts[0].address, nft.address, tokenId, price);
      expect(await nft.ownerOf(tokenId)).to.equal(otherAccounts[0].address);
    });

    it("Should prevent sale (listing is not active)", async function () {
      await expect(marketplace.connect(otherAccounts[0]).buyToken(listingId, { value: price })).to.be.revertedWith("Listing is not active");
    });
  });

  describe("Cancel listing", function () {
    before(async () => {
      nft = await deployNFT();
      marketplace = await deployMarketplace();
      await nft.mint(owner.address);
      await nft.approve(marketplace.address, tokenId);
      await marketplace.listToken(nft.address, tokenId, price);
    });

    it("Should prevent cancellation (only seller can cancel)", async function () {
      await expect(marketplace.connect(otherAccounts[0]).cancel(listingId)).to.be.revertedWith("Only seller can cancel listing");
    });

    it("Should execute cancellation", async function () {
      expect(marketplace.cancel(listingId)).to.emit(marketplace, "Cancel").withArgs(listingId, owner.address);
    });

    it("Should prevent cancellation (listing is not active)", async function () {
      await expect(marketplace.cancel(listingId)).to.be.revertedWith("Listing is not active");
    });
  });
});
