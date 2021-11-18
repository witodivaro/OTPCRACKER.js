function xorHexStrings(hex1, hex2) {
  const firstHexes = hex1.split("");
  const secondHexes = hex2.split("");

  const hexString = firstHexes
    .map((hex, index) => {
      const secondHex = secondHexes[index];
      const [firstHexNumber, secondHexNumber] = [parseInt(hex, 16), parseInt(secondHex, 16)];

      return (firstHexNumber ^ secondHexNumber).toString(16);
    })
    .join("");

  return hexString;
}

function stringToAsciiHex(string) {
  const asciiString = string.split("").map((letter) => letter.charCodeAt(0));

  const asciiHex = asciiString
    .map((hex) => {
      const asciiLetterHex = hex.toString(16);
      const extendedAsciiLetterHex = asciiLetterHex.length === 1 ? "0" + asciiLetterHex : asciiLetterHex;
      return extendedAsciiLetterHex;
    })
    .join("");

  return asciiHex;
}

function asciiHexToString(asciiHex) {
  const hexes = asciiHex.match(/.{1,2}/g);

  return hexes
    .map((hex) => parseInt(hex, 16))
    .map((ascii) => String.fromCharCode(ascii))
    .join("");
}

module.exports = {
  stringToAsciiHex,
  xorHexStrings,
  asciiHexToString,
};
