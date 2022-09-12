import { uInt8ArraySubstitute } from "Utils/bytes";
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
