const Election = artifacts.require('Election');

const eventHelper = (logs, event) => logs.find(log => log.event)

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

  const register = (name, account, value = 1e+18) => election.register(name, { from: account, value });

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
      const [vote, name] = await election.candidateData.call(1, candidate);

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
    const candidateNames = {
      [accounts[0]]: 'wayne',
      [accounts[1]]: 'wei chao',
      [accounts[2]]: 'william',
    };

    const vote = (targetCandidate, voter = accounts[1]) => election.vote(targetCandidate, { from: voter });

    beforeEach('setup candidate', async () => {
      await register('wayne', accounts[0]);
      await register('wei chao', accounts[1]);
      await register('william', accounts[2]);
    });

    it('should work correctly', async () => {
      await election.startVoting();

      const voter = accounts[1];
      const targetCandidate = accounts[0];

      const { logs } = await vote(targetCandidate, voter);
      const eventIndex = logs.findIndex(log => log.event === 'voteCandidate');

      const candidateList = await election.getCandidatesList();
      const candidate = candidateList.find(candidate => candidate === targetCandidate);
      const [ballots, name] = await election.candidateData.call(1, candidate);
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
      await tryCatch(vote(accounts[0]), 'Voting should be started');
    });

    it('should revert if user already voted', async () => {
      await election.startVoting();
      await vote(accounts[0]);

      await tryCatch(vote(accounts[0]), 'Already voted');
      await tryCatch(vote(accounts[1]), 'Already voted');
    });

    it('should revert if user already voted', async () => {
      await election.startVoting();

      await tryCatch(vote(accounts[3]), 'Candidate not exists');
    });
  });

  describe('resetElection()', () => {
    it('should work correclty at zero round', async () => {
      await election.resetElection();
      const round = (await election.round()).toNumber();
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();
      const candidateList = await election.getCandidatesList();

      assert.equal(totalVote, 0);
      assert.equal(round, 2);
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);
    });

    it('should work correclty at first round', async () => {
      // Bad smells(bad pratice) here. Please extract private functions to library to test it if you want to test those private functions.
      const vote = (targetCandidate, voter = accounts[1]) => election.vote(targetCandidate, { from: voter });

      await register('wayne', accounts[0]);
      await register('wei chao', accounts[1]);
      await register('william', accounts[2]);

      await election.startVoting();

      await vote(accounts[0], accounts[0]);
      await vote(accounts[0], accounts[1]);
      await vote(accounts[0], accounts[2]);
      await vote(accounts[1], accounts[3]);
      await vote(accounts[1], accounts[4]);
      await vote(accounts[2], accounts[5]);

      const { logs } = await election.resetElection();
      const electedEventIndex = logs.findIndex(log => log.event === 'elected');
      const refundEvents = logs.reduce((acc, log) => {
        if (log.event === 'refund') {
          acc.push(log);
        }

        return acc;
      }, []);

      const wayneRefundEvent = refundEvents.find(event => event.args.candidate === accounts[0]);
      const weiChaoRefundEvent = refundEvents.find(event => event.args.candidate === accounts[1]);
      const guaranteedDeposit = (await election.guaranteedDeposit()).toNumber();

      const candidateList = await election.getCandidatesList();
      const round = (await election.round()).toNumber();
      const isVoting = await election.isVoting();
      const totalVote = (await election.totalVote()).toNumber();

      assert.equal(totalVote, 0);
      assert.equal(round, 2);
      assert.equal(isVoting, false);
      assert.equal(candidateList.length, 0);

      assert.equal(refundEvents.length, 2);
      assert.equal(wayneRefundEvent.args.amount, guaranteedDeposit);
      assert.equal(weiChaoRefundEvent.args.amount, guaranteedDeposit);
      assert.equal(logs[electedEventIndex].args.round.toNumber(), 1);
      assert.equal(logs[electedEventIndex].args.candidate, accounts[0]);
      assert.equal(logs[electedEventIndex].args.name, 'wayne');
      assert.equal(logs[electedEventIndex].args.vote.toNumber(), 3);
    });

    it('should revert if it is not called by owner', async () => {
      tryCatch(election.resetElection({ from: accounts[1] }), 'Only owner is allowed');
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

      const prevBalance = (await web3.eth.getBalance(accounts[1])).toNumber();

      await election.sponsor(accounts[1], { from: accounts[0], value: 1e+18 });

      const earn = (await web3.eth.getBalance(accounts[1])).toNumber() - prevBalance;

      assert.equal(earn, 1e+18);
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
