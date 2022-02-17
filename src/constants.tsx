const CONTRACT_ADDRESS: string = "0xd95D0777F183924F191b001E885875B0b4De28d2";


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