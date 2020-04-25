import { join } from "path";
import { path } from "../../src/utils/fs";
import { Test, assert, test } from "../helper";

const tests1: Test[] = [
  test("fs.path", () => {
    assert(path === join);
  }),
];

export { tests1 as tests };
