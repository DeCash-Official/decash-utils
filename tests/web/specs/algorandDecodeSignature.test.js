const { expect } = require('chai');

describe('library browser compatibility tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('This is an integration testing page.');
  });

  it('has a lib property', () => {
    cy.window().its('lib.algorandDecodeSignature').should('be.a', 'function');
  });

  it('returns correct result', () => {
    const input = {
      logicsig: {
        args: ['AA=='],
        logic:
          'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
      },
    };

    cy.window()
      .its('lib')
      .invoke('algorandDecodeSignature', input)
      .its('senderDelegatedWallet')
      .should((result) => {
        expect(result.seed).to.equal(0);
        expect(result.validatorAppId).to.equal(71013728);
        expect(result.owner).to.equal(
          'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654'
        );
      });
  });
});
