import { listFiles } from "../../src/utils/fs";
import { assert, group, Test, test } from "../helper";

const tests1: Test[] = group("listFiles/", [
  test("listFiles", () => {
    // TODO
    assert(listFiles);
  }),
]);

export { tests1 as tests };
