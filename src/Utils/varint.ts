const MSB = 0x80;
const REST = 0x7f;
const MSBALL = ~REST;
const INT = Math.pow(2, 31);

export const varIntDecode = (
  buf: Uint8Array,
  { offset = 0 }: { offset?: number } = {}
) => {
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

export const varIntEncode = (
  num: number,
  {
    out = [],
    offset = 0,
    padToBytes = 0,
  }: { out?: number[]; offset?: number; padToBytes?: number } = {}
) => {
  if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Could not encode varint');
  }
  let oldOffset = offset;

  while (num >= INT) {
    out[offset++] = (num & 0xff) | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = (num & 0xff) | MSB;
    num >>>= 7;
  }

  // Padding: custom code.
  out[offset] = num | (out.length < padToBytes ? MSB : 0);
  while (out.length < padToBytes) {
    out.push(out.length === padToBytes - 1 ? 0x00 : 0x80);
  }

  return {
    buf: Uint8Array.from(out),
    bytes: offset - oldOffset + 1,
  };
};
