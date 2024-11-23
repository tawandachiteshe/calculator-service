import { describe, expect, test } from "vitest";

import { add, division, history, multiplication, substract } from "./math";

describe("add", () => {
  test.each([
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 3, expected: 5 },
  ])("add $a + $b = $expected", async ({ a, b, expected }) => {
    const result = await add({ a, b });

    expect(result.result).toBe(expected);
  });
});

describe("multiplication", () => {
  test.each([
    { a: 1, b: 2, expected: 2 },
    { a: 2, b: 3, expected: 6 },
  ])("mult $a * $b = $expected", async ({ a, b, expected }) => {
    const result = await multiplication({ a, b });

    expect(result.result).toBe(expected);
  });
});

describe("division", () => {
  test.each([
    { a: 4, b: 2, expected: 2 },
    { a: 6, b: 3, expected: 2 },
  ])("div $a / $b = $expected", async ({ a, b, expected }) => {
    const result = await division({ a, b });

    expect(result.result).toBe(expected);
  });
});

describe("substract", () => {
  test.each([
    { a: 4, b: 2, expected: 2 },
    { a: 6, b: 3, expected: 3 },
  ])("sub $a - $b = $expected", async ({ a, b, expected }) => {
    const result = await substract({ a, b });

    expect(result.result).toBe(expected);
  });
});

describe("getAdditionHistory", () => {
  test.each([
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 3, expected: 5 },
    { a: 6, b: 6, expected: 12 },
  ])("add $a + $b = $expected", async ({ a, b, expected }) => {
    await add({ a, b });
    const items = await history();

    expect(expected === +items.data[0].output).toBeTruthy();
  });
});

describe("getSubtrationHistory", () => {
  test.each([
    { a: 1, b: 2, expected: -1 },
    { a: 2, b: 3, expected: -1 },
    { a: 6, b: 6, expected: 0 },
  ])("sub $a + $b = $expected", async ({ a, b, expected }) => {
    await substract({ a, b });
    const items = await history();

    expect(expected === +items.data[0].output).toBeTruthy();
  });
});
