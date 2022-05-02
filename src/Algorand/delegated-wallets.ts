import { delegatedWalletData } from 'Const';
import { DelegatedWalletInterpolatedData } from 'Types';
import {
  decodeType,
  encodeType,
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

  const templateSigByteArray = Uint8Array.from(
    atob(delegatedWalletData.templateBytecodeBase64),
    (c) => c.charCodeAt(0)
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
  const result: Partial<DelegatedWalletInterpolatedData> = {};

  for (const [name, { array }] of Object.entries(extractedSig)) {
    const interpolation = delegatedWalletData.interpolated[name as Keys];
    if (!interpolation) {
      continue;
    }

    (result[name as keyof DelegatedWalletInterpolatedData] as any) = decodeType(
      array,
      interpolation.type
    );
  }

  return {
    senderDelegatedWallet: result as DelegatedWalletInterpolatedData,
  };
};

export const algorandGetDelegatedWalletLogicSig = (
  interpolatedData: DelegatedWalletInterpolatedData
): Uint8Array => {
  const templateSigByteArray = Uint8Array.from(
    atob(delegatedWalletData.templateBytecodeBase64),
    (c) => c.charCodeAt(0)
  );
  return uInt8ArraySubstitute(
    templateSigByteArray,
    Object.entries(delegatedWalletData.interpolated).map(
      ([name, { type, fromByte, lengthBytes }]) => {
        return {
          at: fromByte,
          array: encodeType(
            interpolatedData[name as keyof DelegatedWalletInterpolatedData],
            type,
            {
              padToBytes: lengthBytes,
            }
          ),
        };
      }
    )
  );
};
