import Web3 from '@cobinhood/web3';
import { DEXON_TESTNET, LOTTERY_ADDRESS } from './constants';
import { abi } from '../../../build/contracts/Lottery.json';

const web3 = new Web3(new Web3.providers.HttpProvider(DEXON_TESTNET));
const lotteryContract = new web3.eth.Contract(abi, LOTTERY_ADDRESS);

export default lotteryContract;
