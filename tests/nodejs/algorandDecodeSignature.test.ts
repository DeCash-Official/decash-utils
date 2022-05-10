import { expect } from 'chai';
import { algorandDecodeSignature } from '../../lib';

describe('algorandDecodeSignature', () => {
  it('decodes valid signature', () => {
    const { senderDelegatedWallet } = algorandDecodeSignature({
      logicsig: {
        args: ['AA=='],
        logic:
          'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhpXAAE0AUAAG4ABThJAAAQiQv+1NAA0AMIaVwABgAF2EkL/pYABWUL/4ogAEDUBQv+BMRcuKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
      },
    });

    expect(!!senderDelegatedWallet).to.be.true;
    expect(senderDelegatedWallet!.seed).to.be.equal(0);
    expect(senderDelegatedWallet!.validatorAppId).to.be.equal(71013728);
    expect(senderDelegatedWallet!.owner).to.be.equal(
      'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654'
    );
  });

  it('does not decode invalid signature', () => {
    const { senderDelegatedWallet } = algorandDecodeSignature({
      logicsig: {
        args: ['AA=='],
        logic:
          'BSACAAEaASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
      },
    });

    expect(senderDelegatedWallet).to.be.undefined;
  });
});
