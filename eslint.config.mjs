import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import": importPlugin,
      "@next/next": nextPlugin,
      'react-compiler': reactCompiler,
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      "import/resolver": {
        "typescript": {
          "project": "./tsconfig.json"
        },
        "node": true
      }
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...nextPlugin.configs["recommended"].rules,
      ...tsPlugin.configs["strict"].rules,
      ...tsPlugin.configs["stylistic"].rules,
      ...importPlugin.configs["recommended"].rules,
      ...importPlugin.configs["typescript"].rules,
      'react-compiler/react-compiler': 'warn',
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ]
    }
  }
];