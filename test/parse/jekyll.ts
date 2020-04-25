import * as parseBaseModule from "../../src/parse/base";
import {
  listEntryIds,
  parseEntry as parseEntryType,
} from "../../src/parse/jekyll";
import { assert, group, sinon, Test, test } from "../helper";

const tests1: Test[] = group("jekyll/", [
  test("listEntryIds", () => {
    // re-export listEntryIds
    assert.deepStrictEqual(listEntryIds, parseBaseModule.listEntryIds);
  }),

  test("parseEntry", () => {
    // TODO
    assert(1 === 1);
    assert(sinon);
    assert(parseEntryType);
  }),
]);

export { tests1 as tests };
