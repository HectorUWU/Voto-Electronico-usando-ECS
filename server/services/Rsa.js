const crypto = require("crypto");

const Rsa = function (rsa) {
  this.publicKey = rsa.publicKey;
  this.privateKey = rsa.privateKey;
};

Rsa.cifrar = function (publicKey, data) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(data)
  );
  return encryptedData.toString("base64");
};

Rsa.descifrar = function (privateKey, data, pass) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: pass,
    },
    Buffer.from(data, "base64")
  );
  return decryptedData.toString();
};

module.exports = Rsa;