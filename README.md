# Type Fighter

[<img src="https://img.shields.io/badge/Project%20Status-Abandoned-red">](https://img.shields.io/badge/Project%20Status-Abandoned-red)

**Abandoned in WIP:**
I started this project to understand how state channels would work in a fast-paced game, like a typing game
where players have to communicate with each other continuously. It didn't pan out as expected due to
implementation challenges. Following are some that broke me,
1. None of the libraries that I'm using are being actively maintained.
2. To prove that Alice has sent a message, she needs to sign her message. Signing using metamask requires an explicit confirmation by user through a popup, which can be annoying given there can be 1000s of messages that needs to be signed. One option was to simply get the person's private key through input directly, which felt hacky.
3. WebRTC was painful to work with. It is impacted by a lot of network related restrictions and requires setting up a TURN server. A WebSocket connection seemed easier, but was less exciting to use.

State Channels seemed like the wrong solution for this fun problem. I learnt a lot about state channels, which is what I intended to do. More than anything else, I simply lost interest in this project.



A TypeRacer clone built on the Ethereum BlockChain and making off-chain
computations for instant finality using State Channels. This application 
is modelled as a force move game. Read more [here](https://magmo.com/force-move-games.pdf).

## Requirements

1. [Truffle](https://trufflesuite.com/docs/truffle/getting-started/installation)
1. [@truffle/hdwallet-provider](https://www.npmjs.com/package/@truffle/hdwallet-provider)
1. [Ganache CLI](https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/)
1. Node v10.16+
1. Peer JS Server

## Setup

### BlockChain

```
git clone https://github.com/shb9019/Type-Fighter.git
cd Type-Fighter
npm install
```
Start the local blockchain for testing
```
ganache-cli -p 8545 
```
Set config values in `test/config.js`
```
truffle compile
truffle test # Make sure all tests pass
truffle deploy
```

### FrontEnd

```
cd client/
npm install
npm start
```

### Backend

```
cd server/
npm install
npm start
```