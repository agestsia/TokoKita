const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

const ENC_KEY = process.env.DB_ENCRYPTION_KEY;

function getKey() {
  if (!ENC_KEY) throw new Error("DB_ENCRYPTION_KEY tidak diset di .env");

  let keyBuf = Buffer.from(ENC_KEY, "utf8");
  if (keyBuf.length !== 32) {
    keyBuf = crypto.createHash("sha256").update(ENC_KEY).digest();
  }

  return keyBuf;
}

function encrypt(plain) {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(plain), "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(encBase64) {
  const data = Buffer.from(encBase64, "base64");
  const iv = data.slice(0, IV_LEN);
  const tag = data.slice(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = data.slice(IV_LEN + TAG_LEN);

  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return plain.toString("utf8");
}

module.exports = { encrypt, decrypt };
