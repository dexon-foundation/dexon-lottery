/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require('truffle-hdwallet-provider');
const secret = require('./secret');

const mnemonic = secret.mnemonic;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    testnet: {
      provider: new HDWalletProvider(mnemonic,
        'https://testnet-rpc.dexon.org', 0, 1, true, "m/44'/237'/0'/0/"),
      network_id: '*',
      gasPrice: 24000000000,
    },

    development: {
      network_id: '*',
      host: 'localhost',
      port: 8545,
      gasLimit: 7984452,
    },
  },

  // compilers: {
  //   solc: {
  //     version: '0.5.2', // ex:  "0.4.20". (Default: Truffle's installed solc)
  //   },
  // },
};
