import { group, Test } from "../helper";
import { tests as formatJsonTests } from "./format-json";
import { tests as listFilesTests } from "./list-files";
import { tests as parseJsonTests } from "./parse-json";
import { tests as pathTests } from "./path";
import { tests as readFileTests } from "./read-file";
import { tests as writeFileTests } from "./write-file";

const tests1: Test[] = group("fs/", [
  ...formatJsonTests,
  ...listFilesTests,
  ...parseJsonTests,
  ...pathTests,
  ...readFileTests,
  ...writeFileTests,
]);

export { tests1 as tests };
