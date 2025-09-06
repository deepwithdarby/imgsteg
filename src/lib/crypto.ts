// @ts-nocheck
// Using browser's built-in Web Crypto API for AES-GCM encryption/decryption.

const ALGORITHM = 'AES-GCM';
const KEY_DERIVATION_ALGORITHM = 'PBKDF2';
const HASH = 'SHA-256';
const ITERATIONS = 100000;
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits for GCM

// Key derivation from password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: KEY_DERIVATION_ALGORITHM },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: KEY_DERIVATION_ALGORITHM,
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    baseKey,
    { name: ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// ArrayBuffer to Base64
function toBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Base64 to ArrayBuffer
function fromBase64(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encrypt(plaintext: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const key = await deriveKey(password, salt);
  
  const plaintextBuffer = new TextEncoder().encode(plaintext);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    plaintextBuffer
  );

  const saltB64 = toBase64(salt);
  const ivB64 = toBase64(iv);
  const encryptedB64 = toBase64(encryptedBuffer);

  // Prepend salt and IV to the encrypted data for use during decryption
  return `${saltB64}.${ivB64}.${encryptedB64}`;
}

export async function decrypt(ciphertext: string, password: string): Promise<string> {
  const parts = ciphertext.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format.');
  }
  
  const [saltB64, ivB64, encryptedB64] = parts;

  const salt = new Uint8Array(fromBase64(saltB64));
  const iv = new Uint8Array(fromBase64(ivB64));
  const encryptedBuffer = fromBase64(encryptedB64);

  const key = await deriveKey(password, salt);
  
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encryptedBuffer
  );

  return new TextDecoder().decode(decryptedBuffer);
}
