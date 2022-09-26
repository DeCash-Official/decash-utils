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
  initializeBinaryContract,
  getStatelessContractAddress
} from '../../lib';
import { uInt8ArrayEquals, uInt8ArraysConcat } from '../../lib/Utils';

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

  it('Initialize binary contract', () => {
    const templateBytecodeBase64 = btoa('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!"£$%&/()=?^[]{}@#')
    const templateBytecodeUinta = base64ToUInt8Array(templateBytecodeBase64)
    const template: {
      templateBytecodeBase64: string;
      interpolated: {
        [key: string]: {
          type: 'address' | 'varint';
          fromByte: number;
          lengthBytes: number;
        };
      };
    } = {
      templateBytecodeBase64,
      interpolated: {
        test_a: {
          type: 'address',
          fromByte: 8,
          lengthBytes: 32,
        },
        test_b: {
          type: 'varint',
          fromByte: 64,
          lengthBytes: 9,
        },
      },
    };
    
    const result = initializeBinaryContract(template, {
      test_a: 'PUQHXUYYKNFSMQ4PTNT647WOKZ2622OZDBDXNIPJJIZJR6YUI3WQICVFHA',
      test_b: 245
    });

    expect(uInt8ArrayEquals(templateBytecodeUinta, result)).to.be.equal(false);
    expect(uInt8ArrayEquals(templateBytecodeUinta, result)).to.be.equal(false);
    expect(uInt8ArrayEquals(result, uInt8ArraysConcat(
      base64ToUInt8Array(btoa('abcdefgh')),
      algorandAddressToUInt8Array('PUQHXUYYKNFSMQ4PTNT647WOKZ2622OZDBDXNIPJJIZJR6YUI3WQICVFHA'),
      base64ToUInt8Array(btoa('OPQRSTUVWXYZ1234567890!"')),
      varIntToUInt8Array(245, { padToBytes: 9 }),
      base64ToUInt8Array(btoa('^[]{}@#'))
    ))).to.be.equal(true);
  })

  it('Get contract address', () => {
    const delegatedWalletData: {
      templateBytecodeBase64: string;
      interpolated: {
        [key: string]: {
          type: 'address' | 'varint';
          fromByte: number;
          lengthBytes: number;
        };
      };
    } = {
      templateBytecodeBase64:
        'BSACAAEmASB1mkiAY4klIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChIge3qufvFrNmyc0gxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgfLohaOWjduwdhJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhpXAAE0AUAAG4ABThJAAAQiQv+1NAA0AMIaVwABgAF2EkL/pYABWUL/4ogAEDUBQv+BMRcuKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
      interpolated: {
        owner: {
          type: 'address',
          fromByte: 8,
          lengthBytes: 32,
        },
        seed: {
          type: 'varint',
          fromByte: 43,
          lengthBytes: 9,
        },
        validatorAppId: {
          type: 'varint',
          fromByte: 115,
          lengthBytes: 9,
        },
      },
    };
    
    expect(getStatelessContractAddress(delegatedWalletData, {
      owner: 'LX2XVJP7F5TQVOJ6DL4NPR5RH77XEG5US76WL7LIJL7OW6YPXDNPGIFWPM',
      seed: 1,
      validatorAppId: 71013728, 
    })).to.be.equal('SWJOJZ5EVZMA54CNL32JTA524N2VM3THLAM6BZZR7Q7YW63BLLBHHMO7XI')
  });
});
