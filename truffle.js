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

var HDWalletProvider = require("truffle-hdwallet-provider");
var secret = require('./secret');
var mnemonic = secret.mnemonic;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    testnet: {
      provider: new HDWalletProvider(mnemonic,
        "http://testnet.dexon.org:8545", 0, 1, true, "m/44'/237'/0'/0/"),
      network_id: "*"
    },
    development: {
      network_id: '*',
      host: "localhost",
      port: 8545,
      gas: 4712388
    }
  }
};
