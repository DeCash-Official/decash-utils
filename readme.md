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

## Development

To make a new package version,

1. Add a new type and add it to the test, ensuring it's exported.
2. Update the package version in `package.json`.
3. Push or pull request to `main`.
