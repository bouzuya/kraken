import { tests as baseTests } from "./base";
import { tests as bbnTests } from "./bbn";
import { tests as jekyllTests } from "./jekyll";
import { Test } from "../helper";

const tests1: Test[] = ([] as Test[])
  .concat(baseTests)
  .concat(bbnTests)
  .concat(jekyllTests);

export { tests1 as tests };
