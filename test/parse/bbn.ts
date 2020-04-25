import { listEntryIds, parseEntry } from "../../src/parse/bbn";
import * as parseBaseModule from "../../src/parse/base";
import * as utilsFsModule from "../../src/utils/fs";
import { Test, assert, test } from "../helper";

const category = "parse > bbn > ";

const tests1: Test[] = [
  test(category + "listEntryIds", ({ sandbox }) => {
    const listEntryIdsStub = sandbox.stub(parseBaseModule, "listEntryIds");
    assert(listEntryIds === listEntryIdsStub);
  }),

  test(category + "parseEntry", ({ sandbox }) => {
    const meta = {
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      title: "title",
    };
    const data = "markdown";
    const parseJson = sandbox
      .stub(utilsFsModule, "parseJson")
      .onCall(0)
      .returns(meta);
    const path = sandbox
      .stub(utilsFsModule, "path")
      .onCall(0)
      .returns("data/2006/01")
      .onCall(1)
      .returns("data/2006/01/2006-01-02.json")
      .onCall(2)
      .returns("data/2006/01/2006-01-02.md");
    const readFile = sandbox
      .stub(utilsFsModule, "readFile")
      .onCall(0)
      .returns(JSON.stringify(meta))
      .onCall(1)
      .returns(data);
    const entryId = { year: "2006", month: "01", date: "02", title: undefined };
    assert.deepEqual(parseEntry("data", entryId), {
      id: entryId,
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      tags: [],
      title: "title",
      data,
      date: "2006-01-03", // in time zone +09:00
      html: "<p>markdown</p>\n",
    });
    assert(parseJson.callCount === 1);
    assert.deepEqual(parseJson.getCall(0).args, [JSON.stringify(meta)]);
    assert(path.callCount === 3);
    assert.deepEqual(path.getCall(0).args, ["data", "2006", "01"]);
    assert.deepEqual(path.getCall(1).args, ["data/2006/01", "2006-01-02.json"]);
    assert.deepEqual(path.getCall(2).args, ["data/2006/01", "2006-01-02.md"]);
    assert(readFile.callCount === 2);
    assert.deepEqual(readFile.getCall(0).args, [
      "data/2006/01/2006-01-02.json",
    ]);
    assert.deepEqual(readFile.getCall(1).args, ["data/2006/01/2006-01-02.md"]);
  }),
];

export { tests1 as tests };
