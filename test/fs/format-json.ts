import { formatJson } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("formatJson/", [
  test("formatJson", () => {
    assert(formatJson({ foo: 123 }) === '{"foo":123}');
    assert(formatJson({ foo: 123 }, 2) === '{\n  "foo": 123\n}');
  }),
]);

export { tests1 as tests };
