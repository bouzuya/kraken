import { formatJson } from "../../src/utils/fs";
import { migrate } from "../../src/commands/migrate";
import * as parseJekyllModule from "../../src/parse/jekyll";
import * as utilFsModule from "../../src/utils/fs";
import { Test, assert, test } from "../helper";

const tests1: Test[] = [
  test("migrate.migrate", ({ sandbox }) => {
    const id1 = { year: "2006", month: "01", date: "02", title: undefined };
    const meta1 = {
      minutes: 1,
      pubdate: "2006-01-02T15:04:05-07:00",
      tags: [],
      title: "title",
    };
    const id2 = { year: "2006", month: "01", date: "03", title: "title" };
    const meta2 = {
      minutes: 2,
      pubdate: "2006-01-03T15:04:05-07:00",
      tags: ["misc"],
      title: "title2",
    };
    const writeFile = sandbox.stub(utilFsModule, "writeFile");
    const listEntryIds = sandbox
      .stub(parseJekyllModule, "listEntryIds")
      .returns([id1, id2]);
    const parseEntry = sandbox.stub(parseJekyllModule, "parseEntry");
    parseEntry
      .onCall(0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns(Object.assign({}, meta1, { data: "2006-01-02" }) as any); // FIXME
    parseEntry
      .onCall(1)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns(Object.assign({}, meta2, { data: "2006-01-03" }) as any); // FIXME

    migrate("old-data", "new-data");
    assert(listEntryIds.callCount === 1);
    assert(listEntryIds.getCall(0).args[0] === "old-data");
    assert(parseEntry.callCount === 2);
    assert(parseEntry.getCall(0).args[0] === "old-data");
    assert.deepEqual(parseEntry.getCall(0).args[1], id1);
    assert(parseEntry.getCall(1).args[0] === "old-data");
    assert.deepEqual(parseEntry.getCall(1).args[1], id2);
    assert(writeFile.callCount === 4);
    assert(writeFile.getCall(0).args[0] === "new-data/2006/01/2006-01-02.json");
    assert(writeFile.getCall(0).args[1] === formatJson(meta1, 2));
    assert(writeFile.getCall(1).args[0] === "new-data/2006/01/2006-01-02.md");
    assert(writeFile.getCall(1).args[1] === "2006-01-02");
    assert(
      writeFile.getCall(2).args[0] === "new-data/2006/01/2006-01-03-title.json"
    );
    assert(writeFile.getCall(2).args[1] === formatJson(meta2, 2));
    assert(
      writeFile.getCall(3).args[0] === "new-data/2006/01/2006-01-03-title.md"
    );
    assert(writeFile.getCall(3).args[1] === "2006-01-03");
  }),
];

export { tests1 as tests };
