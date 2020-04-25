import { tests as commandsTests } from "./commands";
import { tests as formatTests } from "./format";
import { tests as fsTests } from "./fs";
import { group, run, Test } from "./helper";
import { tests as parseTests } from "./parse";
import { tests as repositoryTests } from "./repository";

const tests1: Test[] = group("/", [
  ...commandsTests,
  ...fsTests,
  ...formatTests,
  ...parseTests,
  ...repositoryTests,
]);

run(tests1).catch((_) => void process.exit(-1));
