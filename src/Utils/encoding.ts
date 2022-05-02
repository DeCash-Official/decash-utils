import { decodeAlgorandAddress, encodeAlgorandAddress } from './address';
import { varIntDecode, varIntEncode } from './varint';

export const decodeType = (array: Uint8Array, type: 'varint' | 'address') => {
  return type === 'varint'
    ? varIntDecode(array).int
    : type === 'address'
    ? decodeAlgorandAddress(array)
    : '';
};

export const encodeType = (
  value: string | number,
  type: 'varint' | 'address',
  { padToBytes }: { padToBytes?: number } = {}
) => {
  return type === 'varint'
    ? varIntEncode(+value, { padToBytes }).buf
    : type === 'address'
    ? encodeAlgorandAddress(value.toString())
    : new Uint8Array(0);
};
