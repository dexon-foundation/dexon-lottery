import { Observable } from 'rxjs/Observable';

const rxTestHelper = (source$, mockOperators = []) => new Promise((resolve, reject) => {
  const sequence = [];

  // mock operators to simple `do` and push the calls to sequence;
  mockOperators.forEach((operator) => {
    jest.spyOn(Observable.prototype, operator)
      .mockImplementation(function (...args) { // eslint-disable-line func-names
        return this.do(() => {
          sequence.push({
            operator,
            calls: args,
          });
        });
      });
  });

  // restore each operators
  const tearDown = () => {
    mockOperators.forEach((operator) => {
      Observable.prototype[operator].mockRestore();
    });
  };

  source$.subscribe({
    next: (result) => {
      sequence.push(result);
    },
    error: (err) => {
      tearDown();
      reject(err);
    },
    complete: () => {
      tearDown();
      resolve(sequence);
    },
  });
});

export default rxTestHelper;
