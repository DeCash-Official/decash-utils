const MSB = 0x80;
const REST = 0x7f;

export const decodeVarInt = (buf: Uint8Array, offset: number = 0) => {
  let res = 0;
  let shift = 0;
  let counter = offset;
  let b: number;
  let l = buf.length;
  let bytes = 0;

  do {
    if (counter >= l) {
      bytes = 0;
      throw new RangeError('Could not decode varint');
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB);

  bytes = counter - offset;

  return {
    int: res,
    bytes,
  };
};
