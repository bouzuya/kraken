import { parseJson } from "../../src/utils/fs";
import { Test, assert, test } from "../helper";

const tests1: Test[] = [
  test("fs.parseJson", () => {
    assert.deepEqual(parseJson('{"foo":123}'), { foo: 123 });
  }),
];

export { tests1 as tests };
