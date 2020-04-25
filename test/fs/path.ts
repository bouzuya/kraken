import { join } from "path";
import { path } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("path/", [
  test("path", () => {
    assert(path === join);
  }),
]);

export { tests1 as tests };
