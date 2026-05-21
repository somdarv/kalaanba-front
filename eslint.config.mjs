import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Archived prior FE work — preserved for reference, exempt from strict lint.
    "src/components/_archive/**",
    "src/app/legacy/**",
    // Generated code.
    "src/lib/api/generated/**",
  ]),
]);

export default eslintConfig;
