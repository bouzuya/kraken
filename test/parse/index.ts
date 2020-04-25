import { group, Test } from "../helper";
import { tests as baseTests } from "./base";
import { tests as bbnTests } from "./bbn";
import { tests as jekyllTests } from "./jekyll";

const tests1: Test[] = group("parse/", [
  ...baseTests,
  ...bbnTests,
  ...jekyllTests,
]);

export { tests1 as tests };
