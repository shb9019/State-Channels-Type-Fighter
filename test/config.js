const aliceKeys = {
    public: "0x4D696a5cdE6A0d98d65688682734d4F3402bcaa7",
    private: "0x191aa14922f08ac527d88898e190c8b2576920049d93cc92c0969e595c3203be"
};
const bobKeys = {
    public: "0x1B07EA131acd973541C4FC377fc61d06CE45A9C8",
    private: "0xebd10795f9993640153125461dd3d7fea967084ed3842761eb615482e39306a3"
}

const mnemonic = "flat duck nominee fragile rate breeze pizza ring pistol myth trial shift";

const methodSignatures = {
    channelHash: 'hash((address,address,uint256))',
    stateHash: 'hash((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)))',
    createChannel: 'createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)))',
    validMove: 'validMove(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)))',
    forceMove: 'forceMove(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)))',
    challenges: 'challenges(bytes32)',
    redeemResolution: 'redeemResolution(bytes32)',
    channelFunds: 'channelFunds(bytes32)',
    respondWithMove: 'respondWithMove(bytes32,((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)))',
    withdrawFunds: 'withdrawFunds(((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256),uint256,uint256,uint256,(uint256,uint256,uint256)),(address,bytes)))'
};

module.exports = {
    aliceKeys,
    bobKeys,
    methodSignatures
};
