import { expect } from 'chai';
import { algorandGetDelegatedWalletLogicSig } from '../../lib';

describe('algorandGetDelegatedWalletLogicSig', () => {
  it('gets correct logic sig', () => {
    const array = algorandGetDelegatedWalletLogicSig({
      owner: 'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654',
      validatorAppId: 71013728,
    });
    const base64 = btoa(String.fromCharCode(...array));
    const expectedBase64 =
      'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=';

    expect(base64).to.be.equal(expectedBase64);
  });

  it('gets incorrect logic sig', () => {
    const array = algorandGetDelegatedWalletLogicSig({
      owner: 'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654',
      seed: 0,
      validatorAppId: 71013728 + 1,
    });
    const base64 = btoa(String.fromCharCode(...array));
    const expectedBase64 =
      'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=';

    expect(base64).not.to.be.equal(expectedBase64);
  });
});
