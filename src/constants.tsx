const CONTRACT_ADDRESS: string = "0xb2e9F8DC04913A6c657c5071cDAf93B5d6f79d75";


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