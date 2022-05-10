import { expect } from 'chai';
import { algorandGetDelegatedWalletAddress } from '../../lib';

describe('algorandGetDelegatedWalletAddress', () => {
  it('correctly encodes address', () => {
    const address = algorandGetDelegatedWalletAddress({
      owner: 'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654',
      validatorAppId: 71013728,
    });

    expect(address).to.be.equal(
      'FL5EXREPO2BDHU4VN5HGPVSJJFHY3THYJXPHPSQGXSQUN3CNP6RYTAW24M'
    );
  });
});
