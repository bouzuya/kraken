import { run, Test } from "beater";
import { fixture, name as nameFn, named as namedFn } from "beater-helpers";
import * as assert from "power-assert";
import * as sinon from "sinon";

function group(name: string, tests: Test[]): Test[] {
  return tests.map((t) => namedFn(name + nameFn(t), t));
}

function test(
  name: string,
  testFn: (context: { sandbox: sinon.SinonSandbox }) => unknown
): Test {
  return namedFn(
    name,
    fixture(
      () => sinon.createSandbox(),
      (sandbox) => void sandbox.restore(),
      (sandbox) => testFn({ sandbox })
    )
  );
}

export { Test, assert, group, run, sinon, test };
