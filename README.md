# Hello DEXON
**Hello DEXON** is a simple smart contract utilizing DEXON's unbiased randomness.

## Installation
1. `git clone https://github.com/dexon-foundation/hello-dexon.git`
2. `cd hello-dexon`
3. `npm install`

## Compile
1. `npm run compile`

## Deploy contract (on DEXON testnet)
1. Copy `secret.js.sample` to `secret.js`.
2. Set the `mnemonic` in `secret.js`.
3. `truffle migrate --network=testnet`
