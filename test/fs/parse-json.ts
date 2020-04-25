import { parseJson } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("parseJson/", [
  test("parseJson", () => {
    assert.deepEqual(parseJson('{"foo":123}'), { foo: 123 });
  }),
]);

export { tests1 as tests };
