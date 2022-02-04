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

    struct Opponent {
        string name;
        string imageURI;
        uint256 maxFunds;
        uint256 currentFunds;
        uint256 wagerSize;
    }

    Opponent public opponent;

    // nft id to its attributes
    mapping(uint256 => CharacterTraits) public characterMetadata;
    // address to its owned token id
    mapping(address => uint256) public ownerCharacterIds;


    event CharacterMint(uint256 tokenId, string name);
    event DiceRoll(uint256 playerRoll, uint256 opponentRoll);

    constructor(
        string[] memory names,
        string[] memory imageURIs,
        uint[] memory initialFunds,
        uint[] memory wagerSizes,
        string memory opponentName,
        string memory opponentImageURI,
        uint256 opponentFunds,
        uint256 opponentWagerSize
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

        opponent = Opponent({
            name: opponentName,
            imageURI: opponentImageURI,
            maxFunds: opponentFunds,
            currentFunds: opponentFunds,
            wagerSize: opponentWagerSize
        });

        // to avoid default uint256 value in mappings (0)
        _tokenIds.increment();

        console.log("initialized %s default characters and opponent", defaultTraits.length);
    }

    function mintCharacterNFT(uint256 _characterIndex) external {

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
        console.log("minting tokenId %s", nextTokenId);
        // map the owner to the new character id
        ownerCharacterIds[msg.sender] = nextTokenId;
        _tokenIds.increment();

        console.log("Minted character #%s with traits index %s", nextTokenId, _characterIndex);
        emit CharacterMint(nextTokenId, characterMetadata[nextTokenId].name);
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

    function rollTheDice() public {
        // Retrieve the details of msg.sender's nft
        uint256 tokenId = ownerCharacterIds[msg.sender];
        CharacterTraits storage playerCharacter = characterMetadata[tokenId];

        require(tokenId > 0, "No NFT found for this address");
        require(playerCharacter.currentFunds > 0, "player has no funds");
        require(opponent.currentFunds > 0, "opponent has no funds");

        console.log(
            "Player with tokenId about to roll the dice with %s / %s funds with wager size of %s",
            playerCharacter.currentFunds,
            playerCharacter.maxFunds,
            playerCharacter.wagerSize
        );
        console.log(
            "Opponent: %s / %s, wagerSize = %s",
            opponent.currentFunds,
            opponent.maxFunds,
            opponent.wagerSize
        );

        uint256 playerRoll = 0;
        uint256 opponentRoll = 0;

        while (playerRoll == opponentRoll) {
            playerRoll = generateSeeminglyRandomNumber(playerCharacter.name);
            opponentRoll = generateSeeminglyRandomNumber(opponent.name);
        }

        emit DiceRoll(playerRoll, opponentRoll);

        console.log("player roll: %s", playerRoll);
        console.log("opponent roll: %s", opponentRoll);

        if (playerRoll > opponentRoll) {
            // opponent loses and gives away his wager to the player
            if (opponent.currentFunds >= opponent.wagerSize) {
                playerCharacter.currentFunds += opponent.wagerSize;
                opponent.currentFunds -= opponent.wagerSize;
            } else {
                playerCharacter.currentFunds += opponent.currentFunds;
                opponent.currentFunds = 0;
            }
        } else {
            // player loses and gives away his wager to the opponent
            if (playerCharacter.currentFunds >= playerCharacter.wagerSize) {
                opponent.currentFunds += playerCharacter.wagerSize;
                playerCharacter.currentFunds -= playerCharacter.wagerSize;
            } else {
                opponent.currentFunds += playerCharacter.currentFunds;
                playerCharacter.currentFunds = 0;
            }
        }   
    }

    function generateSeeminglyRandomNumber(string memory name) private view returns (uint256) {
        uint256 _randNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    name,
                    msg.sender
                )
            )
        ) % 269;
        // two D6 rolls range = [2, 12]
        return (_randNumber % 11) + 2;
    }

    function getUserNFT() public view returns (CharacterTraits memory) {

        uint256 userNFTId = ownerCharacterIds[msg.sender];
        
        if (userNFTId == 0) {
            CharacterTraits memory noNFT;
            return noNFT;
        } else {
            return characterMetadata[userNFTId];
        }
    }

    function getDefaultCharacterTraits() public view returns (CharacterTraits[] memory) {
        return defaultTraits;
    }

    function getOpponent() public view returns (Opponent memory) {
        return opponent;
    }
}