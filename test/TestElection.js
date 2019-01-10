const Election = artifacts.require('ElectionMock');

const BN = web3.utils.BN;

async function tryCatch(promise, reason) {
  try {
    await promise;
  }
  catch (error) {
    const isErrorOccur = error.message.includes(reason);
    assert.equal(isErrorOccur, true, `Expected to fail with ${reason}, but failed with: ${error.message}`);
  }
};

contract('Election', (accounts) => {
  let election;

  const candidateNames = {
    [accounts[1]]: 'wayne',
    [accounts[2]]: 'wei-chao',
    [accounts[3]]: 'william',
  };

  const candidateAccounts = {
    wayne: accounts[1],
    'wei-chao': accounts[2],
    william: accounts[3],
  };

  const register = (name, account, value = 1e+18) => election.register(name, { from: account, value });

  const processARoundOfVoting = async () => {
    const vote = (targetCandidate, voter = accounts[1]) => election.vote(targetCandidate, { from: voter });

    await register(candidateNames[candidateAccounts['wayne']], candidateAccounts['wayne']);
    await register(candidateNames[candidateAccounts['wei-chao']], candidateAccounts['wei-chao']);
    await register(candidateNames[candidateAccounts['william']], candidateAccounts['william']);

    await election.startVoting();

    await vote(candidateAccounts['wayne'], accounts[4]);
    await vote(candidateAccounts['wayne'], accounts[5]);
    await vote(candidateAccounts['wayne'], accounts[6]);
    await vote(candidateAccounts['wei-chao'], accounts[7]);
    await vote(candidateAccounts['wei-chao'], accounts[8]);
    await vote(candidateAccounts['william'], accounts[9]);

    const { logs } = await election.resetElection();

    return logs;
  }

  beforeEach('setup contract for each test', async () => {
    election = await Election.new();
  });

  describe('startVoting()', () => {
    it('should work correctly', async () => {
      await election.startVoting();
      
      const isVoting = await election.isVoting();

      assert.equal(isVoting, true);
    });

    it('should revert if it is not called by owner', async () => {
      tryCatch(election.startVoting({ from: accounts[1] }), 'Only owner is allowed');
    });
  });

  describe('register()', () => {
    it('should work correctly', async () => {
      const { logs } = await register('william', accounts[1]);
      const eventIndex = logs.findIndex(log => log.event === 'registered');

      const candidateList = await election.getCandidatesList();
      const candidate = candidateList.find(candidate => candidate === accounts[1]);
      const { 0: vote, 1: name } = await election.candidateData.call(1, candidate);

      assert.equal(!!candidate, true);
      assert.equal(vote.toNumber(), 0);
      assert.equal(name, 'william');

      assert.notEqual(eventIndex, -1);
      assert.equal(logs[eventIndex].args.round.toNumber(), 1);
      assert.equal(logs[eventIndex].args.candidate, accounts[1]);
    });

    it('should revert if is in voting peroid', async () => {
      await election.startVoting();
      await tryCatch(register('william', accounts[1]), 'Only allowed before voting period');
    });

    it('should revert if balance is not enough', async () => {
      await tryCatch(register('william', accounts[1], 0.5e+18), 'Insufficient deposit');
    });

    it('should revert if user is already registered', async () => {
      await register('william', accounts[1])
      await tryCatch(register('william', accounts[1]), 'Already registered');
    });
  });

  describe('vote()', () => {
    const vote = (targetCandidate, voter = accounts[1]) => election.vote(targetCandidate, { from: voter });

    beforeEach('setup candidate', async () => {
      await register(candidateNames[candidateAccounts['wayne']], candidateAccounts['wayne']);
      await register(candidateNames[candidateAccounts['wei-chao']], candidateAccounts['wei-chao']);
      await register(candidateNames[candidateAccounts['william']], candidateAccounts['william']);
    });

    it('should work correctly', async () => {
      await election.startVoting();

      const voter = accounts[1];
      const targetCandidate = candidateAccounts['william'];

      const { logs } = await vote(targetCandidate, voter);
      const eventIndex = logs.findIndex(log => log.event === 'voteCandidate');

      const candidateList = await election.getCandidatesList();
      const candidate = candidateList.find(candidate => candidate === targetCandidate);
      const { 0: ballots, 1: name } = await election.candidateData.call(1, candidate);
      const isVoted = await election.voted.call(1, voter);
      const totalVote = (await election.totalVote()).toNumber();

      assert.equal(ballots.toNumber(), 1);
      assert.equal(isVoted, true);
      assert.equal(totalVote, 1);
      assert.equal(candidateNames[targetCandidate], name);

      assert.notEqual(eventIndex, -1);
      assert.equal(logs[eventIndex].args.round.toNumber(), 1);
      assert.equal(logs[eventIndex].args.candidate, targetCandidate);
      assert.equal(logs[eventIndex].args.voter, voter)
    });

    it('should revert if it is not in the voting period', async () => {
      await tryCatch(vote(candidateAccounts['william']), 'Voting should be started');
    });

    it('should revert if user already voted', async () => {
      await election.startVoting();
      await vote(candidateAccounts['william']);

      await tryCatch(vote(candidateAccounts['wayne']), 'Already voted');
      await tryCatch(vote(candidateAccounts['wei-chao']), 'Already voted');
      await tryCatch(vote(candidateAccounts['william']), 'Already voted');
    });

    it('should revert if user already voted', async () => {
      await election.startVoting();

      await tryCatch(vote(accounts[3]), 'Candidate not exists');
    });
  });

  describe('resetElection()', () => {
    it('should work correclty', async () => {
      await election.resetElection();
      const round = (await election.round()).toNumber();
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();
      const candidateList = await election.getCandidatesList();

      assert.equal(totalVote, 0);
      assert.equal(round, 2); // we get two after first round and then reset again 
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);
    });

    it('should work correclty at first round', async () => {
      const logs = await processARoundOfVoting();
      const electedEventIndex = logs.findIndex(log => log.event === 'elected');
      const lengthOfRefundEvents = logs.reduce((acc, log) => (log.event === 'refund' ? acc + 1 : acc), 0);

      const candidateList = await election.getCandidatesList();
      const round = (await election.round()).toNumber();
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();

      assert.equal(totalVote, 0);
      assert.equal(round, 2);
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);
      assert.equal(lengthOfRefundEvents, 2);
      assert(electedEventIndex >= 0);
    });

    it('should revert if it is not called by owner', async () => {
      tryCatch(election.resetElection({ from: accounts[1] }), 'Only owner is allowed');
    });
  });

  describe('refundDeposit()', () => {
    it.only('should work correctly', async () => {
      const getBalance = async (address) => new BN(await web3.eth.getBalance(address));
      const prevWayneBalance = await getBalance(candidateAccounts['wayne']);
      const prevWeiChaoBalance = await getBalance(candidateAccounts['wei-chao']);
      console.log((await getBalance(candidateAccounts['wayne'])).toString());
      const logs = await processARoundOfVoting();
      console.log((await getBalance(candidateAccounts['wayne'])).toString());
      const refundEvents = logs.reduce((acc, log) => {
        if (log.event === 'refund') {
          acc.push(log);
        }

        return acc;
      }, []);
      

      const wayneRefundEvent = refundEvents.find(event => event.args.candidate === candidateAccounts['wayne']);
      const weiChaoRefundEvent = refundEvents.find(event => event.args.candidate === candidateAccounts['wei-chao']);
      const guaranteedDeposit = await election.guaranteedDeposit();
      const nextWayneBalance = await getBalance(candidateAccounts['wayne']);
      const nextWeiChaoBalance = await getBalance(candidateAccounts['wei-chao']);
      console.log(nextWayneBalance.sub(prevWayneBalance).toString());

      assert.equal(refundEvents.length, 2);
      assert(wayneRefundEvent.args.amount.eq(guaranteedDeposit));
      assert(weiChaoRefundEvent.args.amount.eq(guaranteedDeposit));
    });
  });

  describe('announceElectedPerson()', () => {
    it('should work correctly', async () => {
      const logs = await processARoundOfVoting();
      const electedEventIndex = logs.findIndex(log => log.event === 'elected');

      assert(electedEventIndex >= 0);
      assert.equal(logs[electedEventIndex].args.round.toNumber(), 1);
      assert.equal(logs[electedEventIndex].args.candidate, candidateAccounts['wayne']);
      assert.equal(logs[electedEventIndex].args.name, 'wayne');
      assert.equal(logs[electedEventIndex].args.vote.toNumber(), 3);
    });
  });

  describe('getCandidatesList()', () => {
    it('should return list correctly', async () => {
      const candidateList = await election.getCandidatesList();

      assert(candidateList instanceof Array);
    });
  });

  describe('sponsor()', () => {
    it('should work correctly', async () => {
      await register('william', accounts[1]);

      const prevBalance = new BN(await web3.eth.getBalance(accounts[1]));

      await election.sponsor(accounts[1], { from: accounts[0], value: 1e+18 });

      const nextBalance = new BN(await web3.eth.getBalance(accounts[1]));

      const earn = nextBalance.sub(prevBalance);

      assert.equal(web3.utils.fromWei(earn.toString()), 1);
    });

    it('should revert if is in voting period', async () => {
      await register('william', accounts[1]);
      await election.startVoting();

      tryCatch(election.sponsor(accounts[1], { from: accounts[0], value: 1e+18 }), 'Only allowed before voting period');
    });

    it('should revert if is in voting period', async () => {
      tryCatch(election.sponsor(accounts[1], { from: accounts[0], value: 1e+18 }), 'Candidate not exists');
    });
  });
});
