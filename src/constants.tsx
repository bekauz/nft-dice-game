const CONTRACT_ADDRESS: string = "0x8FdD4aeF886a17d10B3c122B2a6b8eA817596588";


const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        maxFunds: characterData.maxFunds.toNumber(),
        currentFunds: characterData.currentFunds.toNumber(),
        wagerSize: characterData.wagerSize.toNumber(),
    }
};

export { CONTRACT_ADDRESS, transformCharacterData };