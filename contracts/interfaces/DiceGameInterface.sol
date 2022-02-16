//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


interface DiceGameInterface {

    function mintCharacterNFT(uint _characterIndex) external;

    function rollTheDice() external;

    function getUserNFT() external view returns (CharacterTraits memory);

    function getOpponent() external view returns (Opponent memory);

    function getDefaultCharacterTraits() external view returns (CharacterTraits[] memory);
}

struct CharacterTraits {
    uint256 index;
    string name;
    string imageURI;
    uint256 maxFunds;
    uint256 currentFunds;
    uint wagerSize;
}

struct Opponent {
    string name;
    string imageURI;
    uint256 maxFunds;
    uint256 currentFunds;
    uint256 wagerSize;
}