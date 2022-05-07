import { expect } from 'chai';
import {
  algorandAddressToUInt8Array,
  base32ToUInt8Array,
  base64ToUInt8Array,
  uInt8ArrayToAlgorandAddress,
  uInt8ArrayToBase32,
  uInt8ArrayToBase64,
  uInt8ArrayToVarInt,
  varIntToUInt8Array,
} from '../../lib';

describe('Utility functions', () => {
  it('algorandAddress -> uInt8Array -> algorandAddress', () => {
    const address =
      'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654';
    expect(
      uInt8ArrayToAlgorandAddress(algorandAddressToUInt8Array(address))
    ).to.be.equal(address);
  });

  it('base32 -> uInt8Array -> base32', () => {
    const address =
      'ZLU7SRAKBPOGHEYQIQW4LDXVJUVSWXC6GCSODYWKICKX5UPSGGGYQCH654';
    expect(uInt8ArrayToBase32(base32ToUInt8Array(address))).to.be.equal(
      address + '======'
    );
  });

  it('varInt -> uInt8Array -> varInt', () => {
    const varInt = 100500;
    expect(uInt8ArrayToVarInt(varIntToUInt8Array(varInt))).to.be.equal(varInt);
  });

  it('base64 -> uInt8Array -> base64', () => {
    const b64 =
      'BSACAAEmASCaFzX+fxiZrczt6PwM6d2y5lB3ztmmAhGgcmaaoVDvDChIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=';
    expect(uInt8ArrayToBase64(base64ToUInt8Array(b64))).to.be.equal(b64);
  });
});
