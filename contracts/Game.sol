//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Game is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct CharacterTraits {
        uint256 index;
        string name;
        string imageURI;
        uint256 maxFunds;
        uint256 currentFunds;
        uint wagerSize;
    }

    CharacterTraits[] defaultTraits;

    mapping(uint256 => CharacterTraits) public characterMetadata;
    mapping(address => uint256) public ownerCharacterIds;

    event CharacterMint(uint256 tokenId, string name);

    constructor(
        string[] memory names,
        string[] memory imageURIs,
        uint[] memory initialFunds,
        uint[] memory wagerSizes
    ) ERC721("DiceGame", "DICE") {

        for (uint i = 0; i < names.length; i++) {
            defaultTraits.push(CharacterTraits({
                index: i,
                name: names[i],
                imageURI: imageURIs[i],
                maxFunds: initialFunds[i],
                currentFunds: initialFunds[i],
                wagerSize: wagerSizes[i]
            }));
        }
        console.log("initialized %s default characters", defaultTraits.length);
    }

    function mintCharacterNFT(uint256 _characterIndex) external returns (uint256) {

        // grab the new item id and _safeMint the nextTokenId to msg.sender
        uint256 nextTokenId = _tokenIds.current();
        _safeMint(msg.sender, nextTokenId); // reverts if given ID exists already

        characterMetadata[nextTokenId] = CharacterTraits({
            index: _characterIndex,
            name: defaultTraits[_characterIndex].name,
            imageURI: defaultTraits[_characterIndex].imageURI,
            maxFunds: defaultTraits[_characterIndex].maxFunds,
            currentFunds: defaultTraits[_characterIndex].currentFunds,
            wagerSize: defaultTraits[_characterIndex].wagerSize
        });

        // map the owner to the new character id
        ownerCharacterIds[msg.sender] = nextTokenId;
        _tokenIds.increment();

        console.log("Minted character #%s with traits index %s", nextTokenId, _characterIndex);
        emit CharacterMint(nextTokenId, characterMetadata[nextTokenId].name);
        return nextTokenId;
    }
}