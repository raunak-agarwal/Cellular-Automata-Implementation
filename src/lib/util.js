export const pad = (n, width, z) => {
  z = z || '0';
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// convert decimal number to binary String
export const dec2bin = (dec) =>
  (dec >>> 0).toString(2);

// ascii to binary, padded 8 bits per character
export const ascii2bin = (string) =>
  string.split('').map((char) => pad(char.charCodeAt(0).toString(2), 8)).join('');
