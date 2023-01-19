import { group, Test } from "../helper";
import { tests as buildTests } from "./build";

const tests1: Test[] = group("commands", [...buildTests]);

export { tests1 as tests };
