const crypto = require('crypto');
const fs = require('fs');

class SignatureVerifier {
  constructor(publicKeyPath) {
    this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  }

  verifySignature(signature, payload) {
    try {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(payload);
      verifier.end();

      const decodedSignature = Buffer.from(signature, 'base64');
      const isVerified = verifier.verify(this.publicKey, decodedSignature);

      if (isVerified) {
        console.log('Signature is valid');
        return true;
      }
      return false;
    } catch (err) {
      console.log('invalid sig')
      console.error(err);
      return false;
    }
  }
}

module.exports = SignatureVerifier;
