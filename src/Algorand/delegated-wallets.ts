import { delegatedWalletData } from 'Const';
import { sha512_256 } from 'js-sha512';
import { DelegatedWalletInterpolatedData } from 'Types';
import {
  decodeType,
  uInt8ArrayEquals,
  uInt8ArrayExtract,
  uInt8ArraysConcat,
  uInt8ArraySubstitute,
  uInt8ArrayToAlgorandAddress,
} from 'Utils';
import { initializeBinaryContract } from 'Utils/contracts';

export const algorandDecodeSignature = ({
  logicsig,
}: {
  logicsig?: {
    args: string[];
    logic: string;
  };
}): {
  senderDelegatedWallet?: Required<DelegatedWalletInterpolatedData>;
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
    senderDelegatedWallet: result as Required<DelegatedWalletInterpolatedData>,
  };
};

export const algorandGetDelegatedWalletLogicSig = (
  interpolatedData: DelegatedWalletInterpolatedData
): Uint8Array => {
  interpolatedData.seed = interpolatedData.seed || 0;

  return initializeBinaryContract(delegatedWalletData, interpolatedData)
};

const PROGRAM = Uint8Array.from([80, 114, 111, 103, 114, 97, 109]); // Literally, "Program" written in the buffer.
export const algorandGetDelegatedWalletAddress = (
  data: DelegatedWalletInterpolatedData
): string => {
  const toSign = uInt8ArraysConcat(
    PROGRAM,
    initializeBinaryContract(delegatedWalletData, data)
  );
  const signed = sha512_256.array(toSign);
  return uInt8ArrayToAlgorandAddress(Uint8Array.from(signed));
};
