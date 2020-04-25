import { group, Test } from "../helper";
import { tests as buildTests } from "./build";
import { tests as migrateTests } from "./migrate";

const tests1: Test[] = group("commands", [...buildTests, ...migrateTests]);

export { tests1 as tests };
