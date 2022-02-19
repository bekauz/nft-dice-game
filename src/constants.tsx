const CONTRACT_ADDRESS: string = "0x1dbBEAaA0594A5c924295F723BcF598bc98cdA8C";


const transformCharacterData = (characterData: any) => {
    console.log(characterData)
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        maxFunds: characterData.maxFunds.toNumber(),
        currentFunds: characterData.currentFunds.toNumber(),
        wagerSize: characterData.wagerSize.toNumber(),
    }
};

export { CONTRACT_ADDRESS, transformCharacterData };