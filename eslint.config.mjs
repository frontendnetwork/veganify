import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
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
      react: reactPlugin,
      'react-hooks': hooksPlugin,
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
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tsPlugin.configs["strict"].rules,
      ...tsPlugin.configs["stylistic"].rules,
      ...importPlugin.configs["recommended"].rules,
      ...importPlugin.configs["typescript"].rules,
      ...hooksPlugin.configs.recommended.rules,
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