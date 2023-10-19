const ALPHABET = Array.from({ length: 26 }, (x, i) =>
  String.fromCharCode(i + 97)
);

export const randomLetter = (random: () => number = Math.random) =>
  ALPHABET[Math.floor(random() * ALPHABET.length)];
