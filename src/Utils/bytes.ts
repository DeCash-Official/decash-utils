export const uInt8ArraySubstitute = (
  array: Uint8Array,
  replace: { at: number; array: Uint8Array }[]
) => {
  const result = new Uint8Array(array.length);
  result.set(array, 0);
  for (const { at, array: replaceArray } of replace) {
    result.set(replaceArray, at);
  }
  return result;
};

export const uInt8ArrayExtract = (
  array: Uint8Array,
  extract: { [key: string]: { fromByte: number; lengthBytes: number } }
) => {
  return Object.entries(extract).reduce(
    (acc, [name, { fromByte, lengthBytes }]) => ({
      ...acc,
      ...{
        [name]: {
          array: array.slice(fromByte, fromByte + lengthBytes),
          at: fromByte,
        },
      },
    }),
    {} as {
      [key in keyof typeof extract]: {
        at: number;
        array: Uint8Array;
      };
    }
  );
};

export const uInt8ArraysConcat = (...arrays: Uint8Array[]) => {
  return Uint8Array.from(
    arrays.reduce((acc, array) => [...acc, ...array], [] as number[])
  );
};

export const uInt8ArrayEquals = (
  arr1: Uint8Array,
  arr2: Uint8Array
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const uInt8ArrayToBase64 = (arr: Uint8Array): string => {
  return btoa(String.fromCharCode.apply(String, arr as unknown as number[]));
};

export const base64ToUInt8Array = (string: string): Uint8Array => {
  return Uint8Array.from(
    atob(string)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
};

const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const uInt8ArrayToBase32 = (
  data: Uint8Array,
  {
    padding,
    variant = 'RFC3548',
  }: {
    padding?: boolean;
    variant?: 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';
  } = {}
) => {
  let alphabet = '';
  let defaultPadding = false;

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648;
      defaultPadding = true;
      break;
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX;
      defaultPadding = true;
      break;
    case 'Crockford':
      alphabet = CROCKFORD;
      defaultPadding = false;
      break;
    default:
      throw new Error('Unknown base32 variant: ' + variant);
  }

  padding = padding !== undefined ? padding : defaultPadding;

  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  if (padding) {
    while (output.length % 8 !== 0) {
      output += '=';
    }
  }

  return output;
};

function readChar(alphabet: string, char: string) {
  var idx = alphabet.indexOf(char);
  if (idx === -1) {
    throw new Error('Invalid character found: ' + char);
  }
  return idx;
}
export const base32ToUInt8Array = (
  input: string,
  {
    variant = 'RFC3548',
  }: {
    variant?: 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';
  } = {}
) => {
  let alphabet = '';

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648;
      input = input.replace(/=+$/, '');
      break;
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX;
      input = input.replace(/=+$/, '');
      break;
    case 'Crockford':
      alphabet = CROCKFORD;
      input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
      break;
    default:
      throw new Error('Unknown base32 variant: ' + variant);
  }

  let length = input.length;
  let bits = 0;
  let value = 0;
  let index = 0;
  let output = new Uint8Array(((length * 5) / 8) | 0);

  for (let i = 0; i < length; i++) {
    value = (value << 5) | readChar(alphabet, input[i]);
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return output;
};
