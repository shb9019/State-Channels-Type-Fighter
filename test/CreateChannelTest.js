const Adjudicator = artifacts.require('Adjudicator');
const {aliceKeys, bobKeys} = require("./config");

const encodeParam = (type, value) => {
    return web3.eth.abi.encodeParameter(type, value);
}

contract("Create Channel Test", async accounts => {
    it("should create correct signature", async () => {
        const publicKey = "0x2d7210fd63c69583be497f2d70188EAb8a2B7945";
        const privateKey = "0x8611019bd1f24cc075429326ccda5866eb66de54775b1a1b183358b4700ed1c6";

        let adjudicator = await Adjudicator.deployed();

        let stateHash = await adjudicator.methods['hash((uint8,(address,address,uint256),uint8,(uint256,uint256)))'].call([
            encodeParam('uint8', 0),
            [accounts[0], accounts[1], encodeParam('uint256', 1)],
            encodeParam('uint256', 10),
            [encodeParam('uint256', 11), encodeParam('uint256', 10)]
        ]);

        let signature = await web3.eth.accounts.sign(stateHash, privateKey);
        let address = web3.eth.accounts.recover(stateHash, signature.v, signature.r, signature.s);

        assert.equal(publicKey, address);
    });

    it("should succeed", async () => {
        let adjudicator = await Adjudicator.deployed();

        const alicePublicKey = aliceKeys.public;
        const alicePrivateKey = aliceKeys.private;

        const bobPublicKey = bobKeys.public;
        const bobPrivateKey = bobKeys.private;

        const preFundSetupType = encodeParam('uint8', 0);
        const channelNonce = encodeParam('uint256', 9);
        const channel = [alicePublicKey, bobPublicKey, channelNonce];
        const channelHash = await adjudicator.methods['hash((address,address,uint256))'].call(channel);
        const turnNum = encodeParam('uint256', 0);
        const aliceResolution = encodeParam('uint256', 5000000);
        const bobResolution = encodeParam('uint256', 5000000);
        const resolutions = [aliceResolution, bobResolution];

        const state = [preFundSetupType, channel, turnNum, resolutions];
        const stateHash = await adjudicator.methods['hash((uint8,(address,address,uint256),uint8,(uint256,uint256)))'].call(state);

        let aliceSignature = await web3.eth.accounts.sign(stateHash, alicePrivateKey);
        let bobSignature = await web3.eth.accounts.sign(stateHash, bobPrivateKey);

        aliceSignature = [alicePublicKey, aliceSignature.signature];
        bobSignature = [bobPublicKey, bobSignature.signature];

        try {
            await adjudicator.methods['createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)))'].sendTransaction(
                [state, aliceSignature],
                [state, bobSignature], {
                    from: alicePublicKey,
                    value: 5000000
                }
            );

            await adjudicator.methods['createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)))'].sendTransaction(
                [state, bobSignature],
                [state, aliceSignature], {
                    from: bobPublicKey,
                    value: 5000000
                }
            );

            assert(true);
        } catch (err) {
            assert(false, "Channel Creation failed");
        }

        const value = await adjudicator.methods['channelFunds(bytes32)'].call(channelHash);
        assert.equal(value.isSet, true, "Channel Fund is not set");
        assert.equal(value.hasAliceFunded, true, "Alice has not funded");
        assert.equal(value.hasBobFunded, true, "Bob has not funded");
        assert.equal(value.resolution.aliceAmount, 5000000, "Alice fund does not match resolution");
        assert.equal(value.resolution.bobAmount, 5000000, "Bob fund does not match resolution");
    });

    it("should fail due to wrong signature content", async () => {
        let adjudicator = await Adjudicator.deployed();

        const alicePublicKey = aliceKeys.public;
        const alicePrivateKey = aliceKeys.private;

        const bobPublicKey = bobKeys.public;
        const bobPrivateKey = bobKeys.private;

        const preFundSetupType = encodeParam('uint8', 0);
        const channelNonce = encodeParam('uint256', 9);
        const channel = [alicePublicKey, bobPublicKey, channelNonce];
        const turnNum = encodeParam('uint256', 0);
        const aliceResolution = encodeParam('uint256', 5000000);
        const bobResolution = encodeParam('uint256', 5000000);
        const resolutions = [aliceResolution, bobResolution];

        const state = [preFundSetupType, channel, turnNum, resolutions];
        const stateHash = await adjudicator.methods['hash((uint8,(address,address,uint256),uint8,(uint256,uint256)))'].call(state);
        let fakeStateHash = stateHash + "0";

        let aliceSignature = await web3.eth.accounts.sign(stateHash, alicePrivateKey);
        let bobSignature = await web3.eth.accounts.sign(fakeStateHash, bobPrivateKey);

        aliceSignature = [alicePublicKey, aliceSignature.signature];
        bobSignature = [bobPublicKey, bobSignature.signature];

        try {
            await adjudicator.methods['createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)))'].sendTransaction(
                [state, bobSignature],
                [state, aliceSignature], {
                    from: bobPublicKey,
                    value: 5000000
                }
            );

            assert(false, "Wrong signature accepted");
        } catch (err) {
            assert(true);
        }
    });

    it("should fail due to wrong signer", async () => {
        let adjudicator = await Adjudicator.deployed();

        const alicePublicKey = aliceKeys.public;
        const alicePrivateKey = aliceKeys.private;

        const bobPublicKey = bobKeys.public;
        const bobPrivateKey = bobKeys.private;

        const preFundSetupType = encodeParam('uint8', 0);
        const channelNonce = encodeParam('uint256', 9);
        const channel = [alicePublicKey, bobPublicKey, channelNonce];
        const turnNum = encodeParam('uint256', 0);
        const aliceResolution = encodeParam('uint256', 5000000);
        const bobResolution = encodeParam('uint256', 5000000);
        const resolutions = [aliceResolution, bobResolution];

        const state = [preFundSetupType, channel, turnNum, resolutions];
        const stateHash = await adjudicator.methods['hash((uint8,(address,address,uint256),uint8,(uint256,uint256)))'].call(state);

        let aliceSignature = await web3.eth.accounts.sign(stateHash, alicePrivateKey);
        // Alice is forging as Bob
        let bobSignature = await web3.eth.accounts.sign(stateHash, alicePrivateKey);

        aliceSignature = [alicePublicKey, aliceSignature.signature];
        bobSignature = [bobPublicKey, bobSignature.signature];

        try {
            await adjudicator.methods['createChannel(((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)),((uint8,(address,address,uint256),uint8,(uint256,uint256)),(address,bytes)))'].sendTransaction(
                [state, aliceSignature],
                [state, bobSignature], {
                    from: alicePublicKey,
                    value: 5000000
                }
            );

            assert(false, "Wrong signature accepted");
        } catch (err) {
            assert(true);
        }
    });
});
