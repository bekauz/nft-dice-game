const CONTRACT_ADDRESS: string = "0x544A8207B56CC1A46541D5abD10494fCCA63fBC8";


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