import Web3 from '@cobinhood/web3';
import { address } from '../../../constants';
import { DEXON_TESTNET } from './constants';
import { abi } from '../../../build/contracts/Lottery.json';

const web3 = new Web3(new Web3.providers.HttpProvider(DEXON_TESTNET));
const lotteryContract = new web3.eth.Contract(abi, address);

export default lotteryContract;
