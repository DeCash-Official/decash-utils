import { uInt8ArrayToAlgorandAddress } from "decash-utils";
import { sha512_256 } from "js-sha512";
import { uInt8ArraysConcat, uInt8ArraySubstitute } from "Utils/bytes";
import { encodeType } from "Utils/encoding";

export function initializeBinaryContract(
  template: {
    templateBytecodeBase64: string,
    interpolated: { [k: string]: { 
      type: 'varint' | 'address', 
      fromByte: number, 
      lengthBytes: number
    } }
  },  
  interpolatedData: { [k: string]: string | number },
): Uint8Array {
  const templateSigByteArray = Uint8Array.from(
    atob(template.templateBytecodeBase64),
    (c) => c.charCodeAt(0)
  );
  
  return uInt8ArraySubstitute(
    templateSigByteArray,
    Object.entries(template.interpolated).map(
      ([name, { type, fromByte, lengthBytes }]) => {
        return {
          at: fromByte,
          array: encodeType(
            interpolatedData[name],
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

export function getStatelessContractAddress(
  template: {
    templateBytecodeBase64: string,
    interpolated: { [k: string]: { 
      type: 'varint' | 'address', 
      fromByte: number, 
      lengthBytes: number
    } }
  },  
  interpolatedData: { [k: string]: string | number },
): string {
  const PROGRAM = Uint8Array.from([80, 114, 111, 103, 114, 97, 109]); // Literally, "Program" written in the buffer.
    const toHash = uInt8ArraysConcat(
      PROGRAM,
      initializeBinaryContract(template, interpolatedData)
    );
    const hashed = sha512_256.array(toHash);
    return uInt8ArrayToAlgorandAddress(Uint8Array.from(hashed));
}
