# DEXON Lottery
Repository for [DEXON lottery event](https://storage.googleapis.com/dexon-lottery/index.html)

## Install
`yarn`

## Contract

### Compile
`npm run contract:compile`

### Testing (By using Ganache)
`npm run contract:test`

### Deploy contract (on DEXON testnet)
1. Copy `secret.js.sample` to `secret.js`.
2. Set the `mnemonic` in `secret.js`.
3. `npm run contract:deploy`

## Webapp

### Develop
`npm run webapp:dev`

### Build
`npm run webapp:build`
