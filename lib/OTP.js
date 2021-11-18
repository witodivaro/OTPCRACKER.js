const { extendStringToLength } = require("./stringHelpers");
const { stringToAsciiHex, xorHexStrings, asciiHexToString } = require("./xor");

class OTP {
  static encrypt(key, text) {
    const extendedKey = extendStringToLength(key, text.length);

    const asciiHexKey = stringToAsciiHex(extendedKey);
    const asciiHexText = stringToAsciiHex(text);

    const encryptedText = xorHexStrings(asciiHexKey, asciiHexText);

    return encryptedText;
  }

  static decrypt(key, text, isHexKey = false) {
    const extendedKey = extendStringToLength(key, text.length / 2);
    const asciiHexKey = stringToAsciiHex(extendedKey);

    const decryptedHexText = xorHexStrings(isHexKey ? extendedKey : asciiHexKey, text);
    const decrypted = asciiHexToString(decryptedHexText);

    return decrypted;
  }
}

module.exports = OTP;
