import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

// Migration note: this config replaces the previous `biome.jsonc` (Ultracite
// Biome presets). Oxlint is not rule-for-rule identical to Biome. Rules whose
// findings would require source changes this migration deliberately does not
// make are turned off below with the reason, so the enforced bar stays at the
// level the Biome configuration actually enforced. See
// docs/agents/plans/2026-11-15-bun-ultracite-cleanup.md for the full
// comparison and the follow-up candidates.
export default defineConfig({
  env: core.env,
  extends: [core, react, next],
  // core.ignorePatterns covers dependencies, build output, generated code,
  // and lock files; service-worker.js is a prebuilt third-party artifact.
  ignorePatterns: [...core.ignorePatterns, "service-worker.js"],
  overrides: [
    {
      // Fluid Functionalism registry files are vendored upstream code (shadcn
      // add). They follow the registry's own conventions and get relinted on
      // every registry update. Rules that fight that style are relaxed here
      // instead of drifting the files from upstream.
      files: [
        "src/components/ui/**",
        "src/components/fluid-hover-highlight.tsx",
        "src/lib/shape-context.tsx",
        "src/lib/icon-context.tsx",
        "src/lib/font-weight.ts",
        "src/lib/size-context.tsx",
        "src/hooks/**",
      ],
      rules: {
        // Vendored style relaxations carried over from the Biome overrides:
        "no-nested-ternary": "off",
        "no-plusplus": "off",
        "no-void": "off",
        // Registry components use cloneElement for the asChild pattern and
        // construct components in effects where Radix requires it.
        "react/no-clone-element": "off",
        "react/static-components": "off",
      },
    },
  ],
  rules: {
    // ── Project decisions carried over from the previous Biome config ──
    // No complexity cap (noExcessiveCognitiveComplexity was off).
    complexity: "off",
    // Project uses function declarations for components and helpers.
    "func-style": "off",
    // Project uses inline type specifiers (import { type X }); Biome's
    // useImportType never enforced top-level type imports.
    "import/consistent-type-specifier-style": "off",
    // Not enforced before the migration (a11y offs from the old config).
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    // Biome useSemanticElements was off (useSemanticElements).
    "jsx-a11y/prefer-tag-over-role": "off",
    // Biome style noExcessiveClassesPerFile was off in the preset.
    "max-classes-per-file": "off",
    // Biome performance noImgElement was off.
    "nextjs/no-img-element": "off",
    // Not enforced before the migration.
    "no-inline-comments": "off",
    // The e2e specs return from promise executors for control flow.
    "no-promise-executor-return": "off",
    // Function hoisting (helpers defined after their call sites) is an
    // established pattern here; Biome only flagged actual TDZ errors.
    "no-use-before-define": "off",
    // Project uses barrel files (index.ts re-exports).
    "oxc/no-barrel-file": "off",
    // The promise plugin was not part of the Biome toolchain.
    "promise/always-return": "off",
    "promise/avoid-new": "off",
    "promise/catch-or-return": "off",
    "promise/prefer-await-to-callbacks": "off",
    "promise/prefer-catch": "off",
    // Not enforced before the migration (useButtonType was off).
    "react/button-has-type": "off",
    // The scanner suppresses exhaustive-deps deliberately
    // (useExhaustiveDependencies was off).
    "react/exhaustive-deps": "off",
    "react/exhaustive-effect-dependencies": "off",
    // Project uses function-declared components.
    "react/function-component-definition": "off",
    "react/globals": "off",
    "react/hook-use-state": "off",
    // Handler props are passed through from prop objects (LanguagePicker).
    "react/jsx-handler-names": "off",
    "react/jsx-no-constructed-context-values": "off",
    // Kept from the Biome react preset: noArrayIndexKey was on, the codebase
    // complies, and the Oxlint preset leaves it off.
    "react/no-array-index-key": "error",
    // Biome security noDangerouslySetInnerHtml was off.
    "react/no-danger": "off",
    // Biome's noNestedComponentDefinitions passed these files; Oxlint's
    // compiler-based detection is stricter. Follow-up candidate.
    "react/no-unstable-nested-components": "off",
    "react/purity": "off",
    "react/refs": "off",
    "react/set-state-in-effect": "off",
    // React Compiler "unimplemented syntax" diagnostics, not lint findings.
    "react/todo": "off",
    // Biome's useAwait passed these shapes (mock factories, next.config).
    "require-await": "off",
    // Biome useSortedKeys was a non-failing assist action, so sort-keys
    // warns instead of failing.
    "sort-keys": "warn",
    // The codebase deliberately mixes Array<T> and T[]; both passed Biome.
    "typescript/array-type": "off",
    // Allow any in .d.ts type shims (noExplicitAny was warn; line-level
    // disables mark the shim sites).
    "typescript/no-explicit-any": "warn",
    // Catch params named err are allowed (IngredientsForm).
    "unicorn/catch-error-name": "off",
    // Project uses PascalCase for component files and models
    // (useFilenamingConvention was off).
    "unicorn/filename-case": "off",
    // Project allows for...of and .forEach (noForEach was off).
    "unicorn/no-array-for-each": "off",
    // Not enforced before the migration. Follow-up candidate.
    "unicorn/no-array-reduce": "off",
    "unicorn/no-await-expression-member": "off",
    // Biome security noDocumentCookie was off.
    "unicorn/no-document-cookie": "off",
    "unicorn/no-unreadable-array-destructuring": "off",
    // Biome's noUselessUndefined passed () => undefined callbacks.
    "unicorn/no-useless-undefined": "off",
    "unicorn/prefer-dom-node-dataset": "off",
    // Not enforced before the migration. Follow-up candidate.
    "unicorn/prefer-set-has": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-string-replace-all": "off",
  },
});
