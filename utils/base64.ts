const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Decodes a base64 string into raw bytes without relying on `atob`/`Buffer`,
 * which are not guaranteed to be globally available on React Native/Hermes.
 * Safe to use identically on web and native.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const withoutPadding = clean.replace(/=+$/, '');
  const byteLength = Math.floor((withoutPadding.length * 6) / 8);
  const bytes = new Uint8Array(byteLength);

  let byteIndex = 0;
  let buffer = 0;
  let bitsFilled = 0;

  for (let i = 0; i < withoutPadding.length; i += 1) {
    const value = BASE64_ALPHABET.indexOf(withoutPadding[i]);
    if (value === -1) continue;

    buffer = (buffer << 6) | value;
    bitsFilled += 6;

    if (bitsFilled >= 8) {
      bitsFilled -= 8;
      bytes[byteIndex] = (buffer >> bitsFilled) & 0xff;
      byteIndex += 1;
    }
  }

  return bytes;
}
