/* eslint-disable import/no-anonymous-default-export */
/** @type {import('eslint').Linter.Config} */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from "typescript-eslint";

export default [...nextCoreWebVitals, ...nextTypescript, {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: tseslint.parser,
    parserOptions: {
      project: "./tsconfig.json"
    }
  },
  plugins: {
    'react-compiler': reactCompiler,
  },
  files: ["**/*.{js,jsx,ts,tsx}"],
  rules: {
    // TypeScript ESLint rules
    ...tseslint.configs.strict.rules,
    ...tseslint.configs.stylistic.rules,

    // React Compiler
    'react-compiler/react-compiler': 'warn',

    // Import ordering
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    "react-hooks/refs": "off",
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/immutability": "off"
  }
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "service-worker.js"]
}];