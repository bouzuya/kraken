import * as fsModule from "fs";
import { readFile } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("readFile/", [
  test("readFile", ({ sandbox }) => {
    const readFileSync = sandbox
      .stub(fsModule, "readFileSync")
      .returns("content");
    assert(readFile("path") === "content");
    assert(readFileSync.callCount === 1);
    const args = readFileSync.getCall(0).args;
    assert(args[0] === "path");
    assert.deepEqual(args[1], { encoding: "utf-8" });
  }),
]);

export { tests1 as tests };
