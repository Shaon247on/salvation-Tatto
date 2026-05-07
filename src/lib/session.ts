// Session utility for encrypting/decrypting session data
// Uses Web Crypto API available in Next.js middleware

const SECRET_KEY =
  process.env.SESSION_SECRET || "your-secret-key-change-in-production";

// Simple hash function for creating a key from the secret
async function createKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("salt-for-session"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// Encrypt session data
export async function encrypt(
  payload: Record<string, unknown>,
): Promise<string> {
  try {
    const key = await createKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedPayload = encoder.encode(JSON.stringify(payload));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedPayload,
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(
      iv.length + new Uint8Array(encrypted).length,
    );
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64
    let binary = "";
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt session");
  }
}

// Decrypt session data
export async function decrypt(
  token: string | undefined,
): Promise<Record<string, unknown> | null> {
  if (!token) return null;

  try {
    const key = await createKey();

    // Convert from base64
    const binary = atob(token);
    const combined = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      combined[i] = binary.charCodeAt(i);
    }

    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted,
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decrypted);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
