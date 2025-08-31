// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PlayerNFT is ERC721URIStorage {
    string public playerName;
    uint public age;
    uint public height;
    uint public salaryRequest;
    string public imageURI;
    string public highlightUrl;
    address public owner;
    bool public signed;

    constructor(
        string memory nftName,
        string memory nftSymbol,
        string memory _name,
        uint _age,
        uint _height,
        uint _salaryRequest,
        string memory _imageURI,
        string memory _highlightUrl,
        address _owner
    ) ERC721(nftName, nftSymbol) {
        playerName = _name;
        age = _age;
        height = _height;
        salaryRequest = _salaryRequest;
        imageURI = _imageURI;
        highlightUrl = _highlightUrl;
        owner = _owner;
        signed = false;
        _mint(_owner, 1);
    }

    function markAsSigned() public {
        signed = true;
    }
}

contract PlayerNFTFactory {
    address[] public deployedNFTs;

    event PlayerCreated(address playerNFTAddress);

    function createPlayerNFT(
        string memory nftName,
        string memory nftSymbol,
        string memory name,
        uint age,
        uint height,
        uint salaryRequest,
        string memory imageURI,
        string memory highlightUrl
    ) public {
        PlayerNFT newNFT = new PlayerNFT(
            nftName,
            nftSymbol,
            name,
            age,
            height,
            salaryRequest,
            imageURI,
            highlightUrl,
            msg.sender
        );
        deployedNFTs.push(address(newNFT));
        emit PlayerCreated(address(newNFT));
    }

    function getAllNFTs() public view returns (address[] memory) {
        return deployedNFTs;
    }
}
