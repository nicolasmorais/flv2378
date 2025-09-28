// A simple, not-secure XOR cipher for demonstration purposes.
// In a real-world application, use a robust, standard library like Web Crypto API.
const SECRET_KEY = 'CopiNoteIsTheBestSecureKeyEver';

export const encrypt = (text: string): string => {
  if (typeof window === 'undefined') return text;
  try {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(SECRET_KEY);
    const encryptedBytes = new Uint8Array(textBytes.length);

    for (let i = 0; i < textBytes.length; i++) {
      encryptedBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    let binaryString = '';
    encryptedBytes.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
  } catch (e) {
    console.error("Encryption failed", e);
    return text; // Fallback to plaintext if encryption fails
  }
};

export const decrypt = (encryptedText: string): string => {
  if (typeof window === 'undefined') return encryptedText;
  if (!encryptedText) return '';
  try {
    const binaryString = atob(encryptedText);
    const encryptedBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      encryptedBytes[i] = binaryString.charCodeAt(i);
    }
    
    const keyBytes = new TextEncoder().encode(SECRET_KEY);
    const decryptedBytes = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decryptedBytes);
  } catch (e) {
    // This can happen if the data is not base64 or not encrypted.
    // Return original text as a fallback for legacy data.
    return encryptedText;
  }
};
