![NPM version](https://img.shields.io/npm/v/decash-utils)
![LICENSE](https://img.shields.io/npm/l/decash-utils)
![Build & publish](https://github.com/DeCash-Official/decash-utils/actions/workflows/build-and-push.yaml/badge.svg)

# decash-utils

Utilities for building on top of [DeCash](https://decash.com) - the most easy-to-use and technically
perfected stablecoin.

Read more about DeCash at [docs.decash.com](https://docs.decash.com). Find the DeCash API reference
[here](http://docs.decash.com/docs/api/overview).

## Installation

```sh
npm install --save decash-utils
```

## Usage

### `algorandDecodeSignature({ logicsig })`

This example demonstrates how to decode a logic signature, which:

1. Shows whether the sender is a Delegated Wallet (when `senderDelegatedWallet` is returned).
2. Gets properties (like the owner or seed) of this Delegated Wallet.

```typescript
import { algorandDecodeSignature } from 'decash-utils';

// A part of the response from {Algorand Indexer (testnet)}/v2/blocks/21198914
const { senderDelegatedWallet } = algorandDecodeSignature({
  logicsig: {
    args: ['AA=='],
    logic:
      'BSACAAEmASDK6flECgvcY5MQRC3FjvVNKytcXjCk4eLKQJV+0fIxjShIgYCAgICAgICAAEgxIDIDEkQtFyMSQACHLRciEkAAeAAiNQA0ADIEDEEAfjQAOBCBBhJAAA8iQAAJNAAjCDUAQv/hI0M0ADgYgeCq7qGAgICAABJAAAQiQv/cNAA4GzEWDUAABCJC/840ADEWwhoiI1I0AUAAG4ABThJAAAQiQv+1NAA0AMIaIiNSgAF2EkL/pYABWUL/4ogAEDUBQv+BLjEXKAQ1AUL/dwAiNQA0ADIEDEEAFDQAOAAoEkAACTQAIwg1AEL/5iOJIok=',
  },
});

if (senderDelegatedWallet) {
  console.log(`
    The transaction sender is DeCash Delegated Wallet, owned by ${senderDelegatedWallet.owner};
    Wallet's seed: ${senderDelegatedWallet.seed};
    Validator smart contract ID: ${senderDelegatedWallet.validatorAppId}.
  `);
} else {
  console.log('The transaction sender is not a DeCash Delegated Wallet.');
}
```

### `algorandGetDelegatedWalletLogicSig({ owner, seed, validatorAppId })`

This example demonstrates how to get the logic signature of a DeCash Delegated Wallet,
which then can be used to sing transaction outgoing from the Delegated Wallet.

```typescript
import { LogicSigAccount, signLogicSigTransaction } from 'algosdk';
import { algorandGetDelegatedWalletLogicSig } from 'decash-utils';

const delegatedWalletCode = algorandGetDelegatedWalletLogicSig({
  owner: '6E63EKJYUPLL4SKM5FNX3PD7HSWZ26XPS7BXYLVWJAPDEK3VA7DERTFV4E', // The owner of the delegated wallet.
  seed: 0, // Optional. Default is 0.
  validatorAppId: 71013728, // Network-dependent. Get the validator APP ID from https://docs.decash.com/docs/concepts/delegated-wallets#verifier
});

const logicSigAccount: LogicSigAccount = new LogicSigAccount(
  delegatedWalletCode,
  [new Buffer.from('\x00')] // "Self-sign"
);
const signedTx = signLogicSigTransaction(txn, logicSigAccount).blob;
```

### Utility functions

You can use these exported utility functions for various purposes.

```typescript
import {
  algorandAddressToUInt8Array,
  base32ToUInt8Array,
  uInt8ArrayToAlgorandAddress,
  uInt8ArrayToBase32,
  uInt8ArrayToVarInt,
  varIntToUInt8Array,
} from 'decash-utils';
```

## Development

To make a new package version,

1. Add a new type and add it to the test, ensuring it's exported.
2. Update the package version in `package.json`.
3. Push or pull request to `main`.

## License

[MIT](LICENSE) © [DeCash](https://decash.com)
