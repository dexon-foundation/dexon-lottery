const Web3 = require('@cobinhood/web3');
const { mnemonicToSeed } = require('bip39');
const { fromMasterSeed } = require('ethereumjs-wallet/hdkey');
const { mnemonic } = require('./secret');
const { address, times } = require('./constants');
const lottery = require('./build/contracts/Lottery.json');

const bunyan = require('bunyan');

// Imports the Google Cloud client library for Bunyan
const { LoggingBunyan } = require('@google-cloud/logging-bunyan');

// Creates a Bunyan Stackdriver Logging client
const loggingBunyan = new LoggingBunyan();

// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log"
const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name": "my-service"
  name: 'dexon-lottery',
  streams: [
    // Log to the console at 'info' and above
    { stream: process.stdout, level: 'info' },
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});

const web3 = new Web3('https://testnet-rpc.dexon.org');

let account;
let contract;

const runTime = (time) => {
  if ((time + 5) > (Date.now() / 1000)) {
    setTimeout(() => runTime(time), 5000);
    return;
  }

  contract.methods.reveal(time).send({
    from: account.address,
    gas: 1000000,
  });

  logger.info(`Revealed for: ${time}`);
};

mnemonicToSeed(mnemonic)
  .then((seed) => {
    const hdWallet = fromMasterSeed(seed);
    const key = hdWallet.derivePath('m/44\'/237\'/0\'/0/0');

    // eslint-disable-next-line no-underscore-dangle
    const privateKey = `0x${key._hdkey._privateKey.toString('hex')}`;

    web3.eth.accounts.wallet.add(privateKey);
    account = web3.eth.accounts.privateKeyToAccount(privateKey);
    contract = new web3.eth.Contract(lottery.abi, address);

    times.forEach(runTime);
  });

logger.info('Service started');
