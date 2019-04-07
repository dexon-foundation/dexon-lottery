const Lottery = artifacts.require("Lottery")

const PREFIX = "Returned error: VM Exception while processing transaction: ";
const tryCatch = async function(promise, errType) {
  try {
    await promise;
    throw null;
  }
  catch (error) {
    assert(error, "Expected an error but did not get one");
    assert(error.message.startsWith(PREFIX + errType), "Expected an error starting with '" + PREFIX + errType + "' but got '" + error.message + "' instead");
  }
};

contract('Lottery Contract', (accounts) => {
  let lotteryContract

  before(async () => {
    lotteryContract = await Lottery.new();
  })

  it("should not have revealed times at first", async function() {
    const count = await lotteryContract.revealedTimesCount();
    assert.equal(count.toString(), '0')
  })

  it("should have revealed data after calling reveal", async function() {
    await lotteryContract.reveal(12345);

    const count = await lotteryContract.revealedTimesCount();
    assert.equal(count.toString(), '1');

    const revealedTime = await lotteryContract.revealedTimes(0);
    assert.equal(revealedTime.toString(), '12345');

    const number = await lotteryContract.numberOfTime(12345);
    assert.notEqual(number.toString(), '0');

    const futureNumber = await lotteryContract.numberOfTime(12346);
    assert.equal(futureNumber.toString(), '0');
  })

  it("should have more revealed data after calling reveal again", async function() {
    await lotteryContract.reveal(12346);

    const count = await lotteryContract.revealedTimesCount();
    assert.equal(count.toString(), '2');

    const revealedTime = await lotteryContract.revealedTimes(1);
    assert.equal(revealedTime.toString(), '12346');

    const number = await lotteryContract.numberOfTime(12346);
    assert.notEqual(number.toString(), '0');
  })

  it("should reject future time", async function() {
    await tryCatch(lotteryContract.reveal(1664631204), 'revert');
  })

  it("should reject duplicated time", async function() {
    await tryCatch(lotteryContract.reveal(12345), 'revert');
  })
})
