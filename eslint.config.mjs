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
  {
    // `_`-prefixed means "destructured only to omit it". The codebase already
    // uses this to strip component props off a rest spread before it reaches
    // the DOM (Avatar, Select) and to swallow a caught error nobody reads
    // (theme-script). It is the convention ESLint documents for the rule, and
    // without the pattern every deliberate use reports as an accident, which
    // is how a warning list stops being read.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);

export default eslintConfig;
