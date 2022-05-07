import { expect } from 'chai';
import {
  algorandAddressToUInt8Array,
  base32ToUInt8Array,
  uInt8ArrayToAlgorandAddress,
  uInt8ArrayToBase32,
  uInt8ArrayToVarInt,
  varIntToUInt8Array,
} from '../../lib';

describe('Utility functions', () => {
  it('algorand address', () => {
    const address =
      'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654';
    expect(
      uInt8ArrayToAlgorandAddress(algorandAddressToUInt8Array(address))
    ).to.be.equal(address);
  });

  it('base32 -> uInt8Array', () => {
    const address =
      'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654';
    expect(uInt8ArrayToBase32(base32ToUInt8Array(address))).to.be.equal(
      address + '======'
    );
  });

  it('varInt -> uInt8Array', () => {
    const varInt = 100500;
    expect(uInt8ArrayToVarInt(varIntToUInt8Array(varInt))).to.be.equal(varInt);
  });
});
