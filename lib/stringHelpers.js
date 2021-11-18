function extendStringToLength(string, length) {
  const stringLetters = string.split("");

  while (stringLetters.length < length) {
    const diff = length - stringLetters.length;
    const toAdd = Math.min(diff, stringLetters.length);
    stringLetters.push(...stringLetters.slice(0, toAdd));
  }

  return stringLetters.join("");
}

module.exports = {
  extendStringToLength,
};
