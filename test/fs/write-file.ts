import * as fsExtraModule from "fs-extra";
import { writeFile } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("writeFile/", [
  test("writeFile", ({ sandbox }) => {
    const outputFileSync = sandbox.stub(fsExtraModule, "outputFileSync");
    assert(typeof writeFile("path", "data") === "undefined");
    assert(outputFileSync.callCount === 1);
    const args = outputFileSync.getCall(0).args;
    assert(args[0] === "path");
    assert(args[1] === "data");
    assert.deepEqual(args[2], { encoding: "utf-8" });
  }),
]);

export { tests1 as tests };
