const CONTRACT_ADDRESS: string = "0x38174306bdC0982Bfc4D7874a99c3072eB9f381B";


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