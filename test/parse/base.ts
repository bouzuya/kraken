import { listEntryIds, parseEntry } from "../../src/parse/base";
import * as utilsFsModule from "../../src/utils/fs";
import { assert, group, sinon, Test, test } from "../helper";

const markdownToHtml = (data: string): string => {
  const meta = {
    minutes: 10,
    pubdate: "2006-01-02T15:04:05-07:00",
    title: "title",
  };
  const entryId = { year: "2006", month: "01", date: "02", title: undefined };
  const { html } = parseEntry("data", entryId, () => ({ meta, data }), {
    noIds: false,
  });
  return html;
};

const tests1: Test[] = group("base/", [
  test("listEntryIds", ({ sandbox }) => {
    const listFiles = sandbox
      .stub(utilsFsModule, "listFiles")
      .returns([
        "/home/bouzuya/data/2006-01-02.md",
        "/home/bouzuya/data/2006-01-03-title.md",
        "/home/bouzuya/data/2006-01-04.json",
      ]);

    assert.deepEqual(listEntryIds("./data"), [
      { year: "2006", month: "01", date: "02", title: undefined },
      { year: "2006", month: "01", date: "03", title: "title" },
    ]);
    assert(listFiles.callCount === 1);
    assert(listFiles.getCall(0).args[0] === "./data");
  }),

  test("parseEntry", () => {
    const meta = {
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      title: "title",
    };
    const data = "markdown";

    const parse = sinon.stub();
    parse.returns({ meta, data });

    const entryId = { year: "2006", month: "01", date: "02", title: undefined };
    assert.deepEqual(parseEntry("data", entryId, parse, { noIds: false }), {
      id: entryId,
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      tags: [],
      title: "title",
      data,
      date: "2006-01-03", // in time zone +09:00
      html: "<p>markdown</p>\n",
    });
    assert(parse.callCount === 1);
    assert.deepEqual(parse.getCall(0).args, ["data", entryId]);
  }),

  test("parseEntry/email like", () => {
    assert.deepStrictEqual(
      markdownToHtml("expand-markdown-anchors@0.3.1"),
      '<p><a href="mailto:expand-markdown-anchors@0.3.1">expand-markdown-anchors@0.3.1</a></p>\n'
    );
  }),

  test("parseEntry/pre element behavior", () => {
    assert.deepStrictEqual(
      markdownToHtml("<pre><code>*foo*</code></pre>"),
      "<pre><code>*foo*</code></pre>"
    );
    assert.deepStrictEqual(
      markdownToHtml("<noscript><pre><code>*foo*</code></pre></noscript>"),
      "<p><noscript><pre><code><em>foo</em></code></pre></noscript></p>\n"
    );
  }),

  test("parseEntry > header id", () => {
    const noIds = false;
    const input = "# 123";
    const output = '<h1 id="123">123</h1>\n';

    const meta = {
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      title: "title",
    };
    const data = input;
    const parse = sinon.stub();
    parse.returns({ meta, data });
    const entryId = { year: "2006", month: "01", date: "02", title: undefined };
    const { html } = parseEntry("data", entryId, parse, { noIds });
    assert(html === output);
  }),

  test("parseEntry > header id (noIds)", () => {
    const noIds = true;
    const input = "# 123";
    const output = "<h1>123</h1>\n";

    const meta = {
      minutes: 10,
      pubdate: "2006-01-02T15:04:05-07:00",
      title: "title",
    };
    const data = input;
    const parse = sinon.stub();
    parse.returns({ meta, data });
    const entryId = { year: "2006", month: "01", date: "02", title: undefined };
    const { html } = parseEntry("data", entryId, parse, { noIds });
    assert(html === output);
  }),
]);

export { tests1 as tests };
