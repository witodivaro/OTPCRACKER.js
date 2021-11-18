const fs = require("fs");
const prompts = require("prompts");

const OTP = require("./lib/OTP");
const { xorHexStrings, asciiHexToString, stringToAsciiHex } = require("./lib/xor");

const existingMap = require("./map.json");

const file = fs.readFileSync("./encrypts.txt", { encoding: "utf-8" });
const encryptedStrings = file.split("\n");
const targetString = encryptedStrings[0];
const helperStrings = encryptedStrings.slice(1);

const KEY = "kekemopi";

const encrypted = OTP.encrypt(KEY, "im the best and you suck");
const encrypted2 = OTP.encrypt(KEY, "hoka amigos amigos holas");

const answer = {};
const result = xorHexStrings(encrypted, encrypted2);

asciiHexToString(result)
  .split("")
  .map((el, index) => {
    answer[index] = el;
  });

function applyAsciiEncryptedHexesToString(string, ...asciiEncrypted) {
  const answer = {};
  const persistingLetters = {};

  asciiEncrypted.forEach((encryptedString) => {
    asciiHexToString(xorHexStrings(string, encryptedString))
      .split("")
      .map((el, index) => {
        if (("A" <= el && el <= "Z") || ("a" <= el && el <= "z")) {
          persistingLetters[index] = persistingLetters[index] ? persistingLetters[index] + 1 : 1;
          const letterHex = stringToAsciiHex(el);
          const actualHex = string.slice(index * 2, index * 2 + 2);

          answer[index] = {
            letter: el,
            letterHex,
            actualHex,
            key: xorHexStrings(letterHex, actualHex),
            pos: index,
          };
        }
      });
  });

  console.log(persistingLetters);

  const ans = Array(300).fill("*");

  Object.keys(answer).forEach((i) => {
    ans[i] = answer[i].letter;
  });

  SPACES.forEach((space) => {
    ans[space] = " ";
  });

  const map = {
    ...existingMap,
    ...answer,
  };

  fs.writeFileSync("map.json", JSON.stringify(map, null, 2));
  return ans.join("");
}

let key =
  "66396e89c9dbd8cc9874352acd6395102eafce78aa7fed28a07f6bc98d29c50b69b0339a19f8aa401a9c6d708f80c066c763fef0123148cdd8e802d05ba98777335daefcecd59c433a6b268b60bf4ef03c9a61";

function showOne(key, index) {
  console.log();
  console.log(OTP.decrypt(key, encryptedStrings[index], true));
}

function showEvery(key) {
  encryptedStrings.forEach((string, i) => {
    console.log();
    console.log([i, OTP.decrypt(key, string, true)].join(": "));
  });
}

async function prompt() {
  showEvery(key);

  const positionResponse = await prompts({
    type: "number",
    name: "pos",
    message: "Which one?",
  });

  const { pos } = positionResponse;
  showOne(key, pos);

  const letterResponse = await prompts({
    type: "text",
    name: "letter",
    message: "What's next?",
  });

  const { letter } = letterResponse;

  const currentBlankPosition = key.indexOf("*");

  const hexedLetter = stringToAsciiHex(letter);
  const hexedMessagePart = encryptedStrings[pos].slice(currentBlankPosition, currentBlankPosition + 2);
  const keyPart = xorHexStrings(hexedLetter, hexedMessagePart);

  tempKey = key.replace(/\*\*/, keyPart);

  showEvery(tempKey);

  const confirmResponse = await prompts({
    type: "select",
    name: "good",
    choices: [
      { title: "Yes", value: true },
      { title: "No", value: false },
    ],
    message: "Is it ok?",
  });

  const { good } = confirmResponse;

  if (good) {
    key = tempKey;
    console.log("key:", key);
  }

  prompt();
}

prompt();
