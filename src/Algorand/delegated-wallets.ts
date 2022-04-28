import { delegatedWalletData } from 'Const';
import {
  decodeVarInt,
  getAlgorandAddressFromBytes,
  uInt8ArrayEquals,
  uInt8ArrayExtract,
  uInt8ArraySubstitute,
} from 'Utils';

export const algorandDecodeSignature = ({
  logicsig,
}: {
  logicsig?: {
    args: string[];
    logic: string;
  };
}): {
  senderDelegatedWallet?: {
    owner: string;
    seed: number;
    validatorAppId: number;
  };
} => {
  if (
    !logicsig ||
    logicsig.logic.replace(/=+$/, '').length !==
      delegatedWalletData.templateBytecodeBase64.replace(/=+$/, '').length
  ) {
    return {};
  }

  const templateSigByteArray = Uint8Array.from(atob(logicsig.logic), (c) =>
    c.charCodeAt(0)
  );
  const sigByteArray = Uint8Array.from(atob(logicsig.logic), (c) =>
    c.charCodeAt(0)
  );

  const extractedSig = uInt8ArrayExtract(
    sigByteArray,
    delegatedWalletData.interpolated
  );
  const templatedSig = uInt8ArraySubstitute(
    templateSigByteArray,
    Object.values(extractedSig)
  );

  if (!uInt8ArrayEquals(sigByteArray, templatedSig)) {
    // Not a Delegated Wallet since it doesn't match logic sig template
    // after replacing the interpolated values.
    return {};
  }

  type Keys = keyof typeof delegatedWalletData.interpolated;
  const result: {
    [key in Keys]: any;
  } = {} as any;

  for (const [name, { array }] of Object.entries(extractedSig)) {
    const interpolation = delegatedWalletData.interpolated[
      name as Keys
    ] as unknown as {
      type: 'address' | 'varint';
      fromByte: number;
      lengthBytes: number;
    };
    if (!interpolation) {
      continue;
    }

    result[name as Keys] =
      interpolation.type === 'varint'
        ? decodeVarInt(array).int
        : interpolation.type === 'address'
        ? getAlgorandAddressFromBytes(array)
        : '';
  }

  return {
    senderDelegatedWallet: result,
  };
};
