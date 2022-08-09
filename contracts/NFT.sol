// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    uint256 MAX_SUPPLY = 3;
    Counters.Counter private _tokenId;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function mint(address to) public {
        uint256 tokenId = _tokenId.current();
        require(tokenId < MAX_SUPPLY, "No NFTs left");
        _tokenId.increment();
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
