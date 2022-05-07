import {
  algorandAddressToUInt8Array,
  uInt8ArrayToAlgorandAddress,
} from './address';
import { uInt8ArrayToVarInt, varIntToUInt8Array } from './varint';

export const decodeType = (array: Uint8Array, type: 'varint' | 'address') => {
  return type === 'varint'
    ? uInt8ArrayToVarInt(array)
    : type === 'address'
    ? uInt8ArrayToAlgorandAddress(array)
    : '';
};

export const encodeType = (
  value: string | number,
  type: 'varint' | 'address',
  { padToBytes }: { padToBytes?: number } = {}
) => {
  return type === 'varint'
    ? varIntToUInt8Array(+value, { padToBytes })
    : type === 'address'
    ? algorandAddressToUInt8Array(value.toString())
    : new Uint8Array(0);
};
