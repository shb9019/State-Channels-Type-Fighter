const aliceKeys = {
    public: "0x2d7210fd63c69583be497f2d70188EAb8a2B7945",
    private: "0x8611019bd1f24cc075429326ccda5866eb66de54775b1a1b183358b4700ed1c6"
};
const bobKeys = {
    public: "0x4966FB2DFB60B637515c59f1B5A0FC437eAD0324",
    private: "0xbeb87e74111d6b61a61faec813c48a7e43f0f92d5d76906c3c44e1e215bcf5ab"
}

const mnemonic = "spy know loan effort survey depend indoor parade predict suffer float room";

const methodSignatures = {
    channelHash: 'hash((address,address,uint256))',
    stateHash: 'hash((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)))',
    createChannel: 'createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)))',
    validMove: 'validMove(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)))',
    forceMove: 'forceMove(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)))',
    challenges: 'challenges(bytes32)',
    redeemResolution: 'redeemResolution(bytes32)',
    channelFunds: 'channelFunds(bytes32)',
    respondWithMove: 'respondWithMove(bytes32,((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256)),(address,bytes)))'
};

module.exports = {
    aliceKeys,
    bobKeys,
    methodSignatures
};
