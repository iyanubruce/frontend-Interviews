import { describe, expect, test } from "vitest";

import WordFinder from "./word-finder";
const runTestCases: any[] = [
  {
    input: [
      [
        "methods",
        [
          "addWord",
          "addWord",
          "search",
          "addWord",
          "search",
          "search",
          "search",
        ],
      ],
      ["params", ["car", "cat", "c.r", "dog", "d.g", "cat", "c.."]],
    ],
    output: [null, null, true, null, true, true, true],
    explanation:
      "Words 'car' and 'cat' are added, 'c.r' matches 'car', 'dog' and 'd.g' match, 'c..' matches both 'car' and 'cat'.",
  },
  {
    input: [
      [
        "methods",
        [
          "addWord",
          "addWord",
          "addWord",
          "search",
          "search",
          "addWord",
          "search",
        ],
      ],
      [
        "params",
        ["hello", "hollow", "hollow", "hell", "hel.o", "hero", "h.o."],
      ],
    ],
    output: [null, null, null, false, true, null, false],
    explanation:
      "The words 'hello', 'hollow' are added, 'hell' doesn't exist, 'hel.o' matches 'hello', 'hero' is added, 'h.o.' does not match with any other word.",
  },
  {
    input: [
      [
        "methods",
        [
          "addWord",
          "search",
          "addWord",
          "search",
          "addWord",
          "search",
          "search",
        ],
      ],
      ["params", ["bat", "b.t", "ball", "ba.l", "bat", "b.ll", "ball"]],
    ],
    output: [null, true, null, true, null, true, true],
    explanation:
      "Words 'bat' and 'ball' are added, 'b.t' matches 'bat', 'ba.l', 'b.ll' and 'ball' match 'ball'.",
  },
];

function processMethods(
  methods: string[],
  words: string[],
): (boolean | null)[] {
  const res: (boolean | null)[] = [];
  const obj = new WordFinder();

  for (let i = 0; i < methods.length; i++) {
    switch (methods[i]) {
      case "addWord": {
        obj.addWord(words[i]);
        res.push(null);
        break;
      }
      case "search": {
        res.push(obj.search(words[i]));
        break;
      }
    }
  }

  return res;
}

describe("WordFinder", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = [${example.input[1][1]}]`, () => {
      const result = processMethods(example.input[0][1], example.input[1][1]);

      expect(result).toStrictEqual(example.output);
    });
  });
});
