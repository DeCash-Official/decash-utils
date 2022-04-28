import { sha512_256 } from 'js-sha512';
import { base32Encode, uInt8ArraysConcat } from './bytes';

const PUBLIC_KEY_LENGTH = 32;
const ALGORAND_ADDRESS_LENGTH = 58;
const ALGORAND_CHECKSUM_BYTE_LENGTH = 4;
const ALGORAND_ADDRESS_BYTE_LENGTH = 36;

export const getAlgorandAddressFromBytes = (buf: Uint8Array): string => {
  if (
    buf.length !==
    ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH
  ) {
    return '';
  }

  const checksum = Uint8Array.from(
    sha512_256
      .array(buf)
      .slice(
        PUBLIC_KEY_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH,
        PUBLIC_KEY_LENGTH
      )
  );
  const addr = base32Encode(uInt8ArraysConcat(buf, checksum));

  return addr.toString().slice(0, ALGORAND_ADDRESS_LENGTH);
};
