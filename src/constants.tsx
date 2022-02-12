const CONTRACT_ADDRESS: string = "0xF5903185D064E292f6416C9F0eA5605E8C95c3D6";


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