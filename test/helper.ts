import { Test, run } from "beater";
import { named as namedFn, fixture } from "beater-helpers";
import * as assert from "power-assert";
import * as sinon from "sinon";

function test(
  name: string,
  testFn: (context: { sandbox: sinon.SinonSandbox }) => unknown
): Test {
  return namedFn(
    name,
    fixture(
      () => sinon.createSandbox(),
      (sandbox) => void sandbox.restore(),
      (sandbox) => (): unknown => testFn({ sandbox })
    )
  );
}

export { Test, assert, run, sinon, test };
