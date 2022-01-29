//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Game {

    struct CharacterTraits {
        uint256 index;
        string name;
        string imageURI;
        uint256 maxFunds;
        uint256 currentFunds;
        uint wagerSize;
    }

    CharacterTraits[] defaultTraits;

    constructor(
        string[] memory names,
        string[] memory imageURIs,
        uint[] memory initialFunds,
        uint[] memory wagerSizes
    ) {

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
}