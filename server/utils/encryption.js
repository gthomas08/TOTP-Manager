const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const initVector = Buffer.from(process.env.ENCRYPTION_VECTOR);
const Securitykey = Buffer.from(process.env.ENCRYPTION_KEY);

const encryptData = (data) => {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
};

const decryptData = (data) => {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(data, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
};

module.exports = {
  encryptData,
  decryptData,
};
