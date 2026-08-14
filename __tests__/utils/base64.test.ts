import { base64ToUint8Array } from '../../utils/base64';

describe('base64ToUint8Array', () => {
  it('decodes a simple ascii string', () => {
    const bytes = base64ToUint8Array('aGVsbG8='); // "hello"
    expect(Buffer.from(bytes).toString('utf-8')).toBe('hello');
  });

  it('decodes without padding characters', () => {
    const bytes = base64ToUint8Array('aGk'); // "hi", no '=' padding
    expect(Array.from(bytes)).toEqual([104, 105]);
  });

  it('decodes an empty string to zero bytes', () => {
    const bytes = base64ToUint8Array('');
    expect(bytes.length).toBe(0);
  });

  it('ignores embedded whitespace/newlines', () => {
    const bytes = base64ToUint8Array('aGVs\nbG8=');
    expect(Buffer.from(bytes).toString('utf-8')).toBe('hello');
  });
});
