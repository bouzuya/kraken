import * as parseBaseModule from "../../src/parse/base";
import {
  listEntryIds,
  parseEntry as parseEntryType,
} from "../../src/parse/jekyll";
import { assert, group, sinon, Test, test } from "../helper";

const tests1: Test[] = group("jekyll/", [
  test("listEntryIds", ({ sandbox }) => {
    const listEntryIdsStub = sandbox.stub(parseBaseModule, "listEntryIds");
    assert(listEntryIds === listEntryIdsStub);
  }),

  test("parseEntry", () => {
    // TODO
    assert(1 === 1);
    assert(sinon);
    assert(parseEntryType);
  }),
]);

export { tests1 as tests };
