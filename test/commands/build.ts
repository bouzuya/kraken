import { compile, compileNew, compileOld } from "../../src/commands/build";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("build/", [
  test("compile", () => {
    // TODO
    assert(compile);
  }),

  test("compileNew", () => {
    assert(compileNew === compile);
  }),

  test("compileOld", () => {
    // TODO
    assert(compileOld);
  }),
]);

export { tests1 as tests };
