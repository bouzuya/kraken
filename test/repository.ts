import { Repository } from "../src/repository";
import { Test, assert, sinon, test } from "./helper";

const category = "/parse/repository";

const tests1: Test[] = [
  test("repository.Repository", () => {
    // TODO
    assert(Repository);
    assert(sinon);
  }),
  test(category + "getEntryIds", () => {
    const dir = "dir1";
    const ids = [{ year: "2006", month: "01", date: "02", title: undefined }];
    const listEntryIds = sinon.stub().returns(ids);
    const parse = sinon.stub();
    const repository = new Repository(dir, listEntryIds, parse);
    const result = repository.getEntryIds();
    assert.deepEqual(result, ids);
    assert(listEntryIds.callCount === 1);
    assert.deepEqual(listEntryIds.getCall(0).args, [dir]);
    assert(parse.callCount === 0);
  }),
];

export { tests1 as tests };
