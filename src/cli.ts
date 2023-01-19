import * as commander from "commander-b";
import * as fs from "fs";
import * as path from "path";
import { build } from "./";

const run = (): void => {
  const packageJsonFile = path.join(__dirname, "..", "package.json");
  const json = fs.readFileSync(packageJsonFile, { encoding: "utf-8" });
  const pkg = JSON.parse(json);
  const command = commander("bbn-api").version(pkg.version);
  command
    .command("build <inDir> <outDir>", "v4 data/ -> dist/")
    .option("--no-ids", "no id")
    .option("--no-tokens-json", "no tokens.json")
    .option("--within <n>", "prev / next entries count")
    .action(
      (
        inDir: string,
        outDir: string,
        options: { noIds?: boolean; noTokensJson?: boolean; within?: string }
      ): Promise<void> => {
        const noIds =
          typeof options.noIds === "undefined" ? false : options.noIds;
        const noTokensJson =
          typeof options.noTokensJson === "undefined"
            ? false
            : options.noTokensJson;
        const within =
          typeof options.within === "undefined"
            ? 4
            : parseInt(options.within, 10);
        return build(inDir, outDir, { noIds, noTokensJson, within });
      }
    );
  command.execute();
};

export { run };
