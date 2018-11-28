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
  
  beforeEach('setup contract for each test', async () => {
    election = await Election.new();
  });

  describe('startVoting()', () => {
    it('should work correctly', async () => {
      const { logs } = await election.startVoting();

      const eventIndex = logs.findIndex(log => log.event === 'voteStart');
      const isVoting = await election.isVoting();

      assert.equal(isVoting, true);
      assert.notEqual(eventIndex, -1);
      assert.equal(logs[eventIndex].args.round.toNumber(), 1);
    });
  });

  describe('register()', () => {
    const register = (fee) => election.register('william', { from: accounts[1], value: fee });

    it('should work correctly', async () => {
      const { logs } = await register(1e+18);
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
      await tryCatch(register(1e+18), 'Only allowed before voting period');
    });

    it('should revert if balance is not enough', async () => {
      await tryCatch(register(0.5+18), 'Insufficient deposit');
    });

    it('should revert if user is already registered', async () => {
      await register(1e+18);
      await tryCatch(register(1e+18), 'Already registered');
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
      const register = (name, account) => election.register(name, { from: account, value: 1e+18 });
      election = await Election.new();
      register('wayne', accounts[0]);
      register('wei chao', accounts[1]);
      register('william', accounts[2]);
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
});
