import { observable, computed } from 'mobx';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { abi } from './constants';

declare global {
  interface Window {
      dexon : any;
      ethereum : any;
  }
}

const DEXON_TESTNET_ID = 238;
const WS_PROVIDER = () => {
  if (window.ethereum) {
    return `ws://${window.location.hostname}:8545`;
  }
  return (window.location.hostname === 'localhost')
  ? 'ws://testnet.dexon.org:8546'
  : 'wss://ws-proxy.dexon.org';
};

const INJECTED = window.dexon || window.ethereum;

class VoteHandler {

  public web3;
  @observable public initDone : boolean = false;
  @observable public contractDataLoaded : boolean = false;
  @observable public isVoting : boolean;
  @observable public round;
  @observable public guaranteedDeposit : string;
  @observable public candidatesList : Array<string> = [];
  @observable public candidateData : {
    [addr : string] : {
      name : string,
      vote : string,
      candidateNumber : string,
    }
  } = {};
  @observable public electedPerson : {
    [round : string] : {
      name : string,
      vote : string,
      candidate : string,
    }
  } = {};
  @observable public sponsorHistory : Array<{
    amount : string,
    round : string,
    candidate : string,
    sponsor : string,
    name : string,
  }> = [];
  @observable public refundHistory : Array<{
    amount : string,
    round : string,
    candidate : string,
    name : string,
  }> = [];

  public contractInit = debounce(async (address : string) => {
    try {
      this.contractWrite = new this.walletHandler.eth.Contract(abi, address);
      this.contractRead = new this.wsHandler.eth.Contract(abi, address);
      this.updateContractData();
      this.subscribeData();
    } catch(e) {
      alert(`init failed: ${e}`);
    }

  }, 200);

  @computed public get guaranteeDepositInDxn() {
    return this.guaranteedDeposit && this.web3.utils.fromWei(this.guaranteedDeposit);
  }

  private walletHandler; // DekuSan Wallet
  private wsHandler; // WS provider

  private contractWrite;
  private contractRead;

  private subscriber = [];

  private updateContractData = throttle(async () => {
    this.contractDataLoaded = false;
    const [
      round,
      isVoting,
      candidatesList,
      guaranteedDeposit,
    ] = await Promise.all([
      this.contractRead.methods.round().call(),
      this.contractRead.methods.isVoting().call(),
      this.contractRead.methods.getCandidatesList().call(),
      this.contractRead.methods.guaranteedDeposit().call(),
    ]);
    this.isVoting = isVoting;
    this.round = round;
    this.candidatesList = candidatesList;
    this.guaranteedDeposit = guaranteedDeposit;
    for (const addr of candidatesList) {
      const data = await this.contractRead.methods.candidateData(round, addr).call();
      const { name, vote, candidateNumber } = data;
      this.candidateData[addr] = { name, vote, candidateNumber };
    }
    // console.log(isVoting, this.candidatesList, this.candidateData);
    this.contractDataLoaded = true;
  }, 500);

  constructor() {
    this.init();
  }

  public startVoting() {
    this.writeContract('startVoting', []);
  }
  public resetElection() {
    this.writeContract('resetElection', []);
  }
  public vote(address : string) {
    this.writeContract('vote', [address]);
  }
  public register(name : string) {
    this.writeContract('register', [name], this.guaranteedDeposit);
  }
  public sponsorCandidate(address : string, amount : string) {
    this.writeContract('sponsor', [address], this.dxnToDei(amount));
  }

  public deiToDxn = (amount) => this.web3.utils.fromWei(amount);
  public dxnToDei = (amount) => this.web3.utils.toWei(amount);

  private writeContract = async (
    method : string, params : Array<any>, value? : string
  ) => {
    if (this.contractWrite) {
      try {
        await INJECTED.enable();
        const walletAddr = await this.getWalletAddress();
        // console.log(walletAddr);
        this.contractWrite
          .methods[method](...params)
          .send({ from: walletAddr, value: value || undefined })
          .on('confirmation', () => {})
          .on('receipt', () => {
            console.log(`successfully performed [${method}]`);
          })
          .on('error', () => console.log('unexpected error'));
      } catch(e) {

      }
    }
  }

  private init = async () => {
    this.web3 = await  import(/* webpackChunkName: "web3" */'web3');
    if (!INJECTED) {
      alert('Please install DekuSan Wallet');
      return;
    }
    this.walletHandler = new this.web3.default(INJECTED);
    const netId = await this.getNetworkId();
    if (
      (netId !== DEXON_TESTNET_ID) &&
      (window.location.hostname !== 'localhost')
    ) {
      alert('Please Select "DEXON Testt Network" in DekuSan wallet');
      return;
    }
    this.wsHandler = new this.web3.default(WS_PROVIDER());
    this.initDone = true;

    // setTimeout(() => this.contractInit('0x623718b15295934386bd7569f42027b911751861'), 500);
  }

  private getNetworkId = () => this.walletHandler.eth.net.getId();
  private getWalletAddress = async () => {
    const addr = await this.walletHandler.eth.getAccounts();
    return addr[0];
  }

  private async subscribeData() {
    this.unsubscribeAndClearAll();

    const pastElectedPerson = await this.contractRead.getPastEvents('elected', { fromBlock: 0, toBlock: 'latest' });
    pastElectedPerson.forEach(this.electedPersonOnReceived);

    const pastSponsorHistory = await this.contractRead.getPastEvents('sponsorCandidate', { fromBlock: 0, toBlock: 'latest' });
    pastSponsorHistory.forEach(this.sponsorOnReceived);

    const pastRefundHistory = await this.contractRead.getPastEvents('refund', { fromBlock: 0, toBlock: 'latest' });
    pastRefundHistory.forEach(this.refundOnReceived);

    this.handleSubscribe('voteStart', () => {
      this.updateContractData();
    });
    this.handleSubscribe('registered', () => {
      this.updateContractData();
    });
    this.handleSubscribe('elected', this.electedPersonOnReceived);

    this.handleSubscribe('sponsorCandidate', this.sponsorOnReceived);
    this.handleSubscribe('refund', this.refundOnReceived);

    this.handleSubscribe('reset', () => {
      this.updateContractData();
    });
    this.handleSubscribe('voteCandidate', () => {
      this.updateContractData();
    });
  }

  private handleSubscribe(eventName : string, cb : (...args : Array<any>) => any) {
    const subscriber = this.contractRead.events[eventName]({}, (err, ...args) => {
      if (!err) {
        cb(...args);
      }
    });
    this.subscriber.push(subscriber);
  }
  private unsubscribeAndClearAll() {
    this.electedPerson = {};
    this.sponsorHistory = [];
    this.refundHistory = [];
    this.subscriber.forEach((sub) => sub.unsubscribe && sub.unsubscribe());
    this.subscriber = [];
  }
  private electedPersonOnReceived = ({ returnValues }) => {
    const { candidate, name, round, vote } = returnValues;
    this.electedPerson[round] = { candidate, name, vote };
  }
  private sponsorOnReceived = ({ returnValues }) => {
    const { candidate, sponsor, round, amount, name } = returnValues;
    this.sponsorHistory.push({ candidate, sponsor, round, amount, name });
  }

  private refundOnReceived = ({ returnValues }) => {
    console.log('refund', returnValues);
    const { candidate, round, amount, name } = returnValues;
    this.refundHistory.push({ candidate, round, amount, name });
  }
}

const voteService = new VoteHandler();

export default voteService;
