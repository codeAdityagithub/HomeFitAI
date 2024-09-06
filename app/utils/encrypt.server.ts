import crypto from "crypto";
import invariant from "tiny-invariant";

const algorithm = "aes-256-cbc";
const enc_secret = process.env.ENC_SECRET; // Store this key securely

invariant(enc_secret, "Encryption secret is required");

const key = Buffer.from(enc_secret, "hex");

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, "utf-8", "hex") + cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(encrypted: string) {
  const [iv, cipher] = encrypted.split(":");

  let decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted =
    decipher.update(cipher, "hex", "utf-8") + decipher.final("utf-8");
  return decrypted;
}
export function encryptEmail(text: string): string {
  let cipher = crypto.createCipheriv(algorithm, key, Buffer.alloc(16, 0));
  const encrypted = cipher.update(text, "utf-8", "hex") + cipher.final("hex");
  // console.log(encrypted);
  return encrypted;
}

export function decryptEmail(cipher: string) {
  let decipher = crypto.createDecipheriv(algorithm, key, Buffer.alloc(16, 0));
  let decrypted =
    decipher.update(cipher, "hex", "utf-8") + decipher.final("utf-8");

  return decrypted;
}
