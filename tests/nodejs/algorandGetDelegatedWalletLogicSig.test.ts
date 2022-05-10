import { expect } from 'chai';
import { algorandGetDelegatedWalletLogicSig } from '../../lib';

const tealCode =
  'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhpXAAE0AUAAG4ABThJAAAQiQv+1NAA0AMIaVwABgAF2EkL/pYABWUL/4ogAEDUBQv+BMRcuKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=';

describe('algorandGetDelegatedWalletLogicSig', () => {
  it('gets correct logic sig', () => {
    const array = algorandGetDelegatedWalletLogicSig({
      owner: 'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654',
      validatorAppId: 71013728,
    });
    const base64 = btoa(String.fromCharCode(...array));
    const expectedBase64 = tealCode;

    expect(base64).to.be.equal(expectedBase64);
  });

  it('gets incorrect logic sig', () => {
    const array = algorandGetDelegatedWalletLogicSig({
      owner: 'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654',
      seed: 0,
      validatorAppId: 71013728 + 1,
    });
    const base64 = btoa(String.fromCharCode(...array));
    const expectedBase64 = tealCode;

    expect(base64).not.to.be.equal(expectedBase64);
  });
});
