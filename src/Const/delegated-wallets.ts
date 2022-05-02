export const delegatedWalletData: {
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
    'BSACAAEmASB1mkiAY4klIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAChIge3qufvFrNmyc0gxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgfLohaOWjduwdhJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
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
