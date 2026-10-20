import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);

// Use the project's compiler and real React renderer without writing build files.
// Each loader has its own module cache so test doubles cannot leak between tests.
export function createLoader({ mocks = {}, globals = {} } = {}) {
  const cache = new Map();
  function load(specifier, from = root) {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (!specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.startsWith("@/")) return require(specifier);
    const base = specifier.startsWith("@/") ? resolve(root, specifier.slice(2)) : resolve(from, specifier);
    if (base.endsWith(".css")) return {};
    const file = [base, `${base}.ts`, `${base}.tsx`, `${base}.json`].find(existsSync);
    if (!file) throw new Error(`Cannot resolve ${specifier} from ${from}`);
    if (cache.has(file)) return cache.get(file);
    const source = readFileSync(file, "utf8");
    if (file.endsWith(".json")) {
      const data = JSON.parse(source);
      cache.set(file, data);
      return data;
    }
    const exports = {};
    cache.set(file, exports);
    const code = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: file,
    }).outputText;
    vm.runInNewContext(code, {
      exports, require: (name) => load(name, dirname(file)), Date, Math, console, ...globals,
    }, { filename: file });
    return exports;
  }
  return (file) => load(`@/${file}`);
}
