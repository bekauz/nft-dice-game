//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libs/Base64.sol";
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

    // nft id to its attributes
    mapping(uint256 => CharacterTraits) public characterMetadata;
    // address to its owned token id
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

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {

        CharacterTraits memory charTraits = characterMetadata[_tokenId];

        string memory currentFundsStr = Strings.toString(charTraits.currentFunds);
        string memory maxFundsStr = Strings.toString(charTraits.maxFunds);
        string memory wagerSizeStr = Strings.toString(charTraits.wagerSize);

        string memory json = Base64.encode(abi.encodePacked(
            '{"name": "', charTraits.name,
                ' -- NFT #: ', Strings.toString(_tokenId),
                '", "description": "NFT that is used to play the dice game.", "image": "',
                charTraits.imageURI,
                '", "attributes": [ { "trait_type": "Funds", "value": ',currentFundsStr,', "max_value":',maxFundsStr,'}, { "trait_type": "Wager Size", "value": ',
                wagerSizeStr,
            '} ]}'
        ));
    
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}