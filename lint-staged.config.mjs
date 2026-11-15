// lint-staged config: format staged files with Bun's built-in formatter and
// auto-fix lint findings with Oxlint. Files under src/components/ui/ are
// vendored design-system code and are excluded from both commands.
// Canonical commands: `bun run lint-staged` and the pre-commit hook.

import path from "node:path";

const VENDORED_PREFIX = "src/components/ui/";
const FORMAT_EXTENSIONS =
  /\.(?:[cm]?[jt]sx?|json|jsonc|css|graphql|html|md|mdx|ya?ml)$/u;
const LINT_EXTENSIONS = /\.[cm]?[jt]sx?$/u;

/**
 * Normalize a staged path (lint-staged may pass absolute paths) to a
 * repo-relative, forward-slash path.
 *
 * @param {string} file - Staged file path, absolute or repo-relative.
 * @returns {string} Repo-relative path with forward slashes.
 */
const toRepoRelative = (file) => {
  const rel = path.isAbsolute(file) ? path.relative(process.cwd(), file) : file;
  return rel.split(path.sep).join("/");
};

/**
 * Quote a file path so spaces survive the shell.
 *
 * @param {string} file - Path to quote.
 * @returns {string} The quoted path.
 */
const quote = (file) => `"${file}"`;

/**
 * Build the lint-staged tasks for the staged files, skipping the vendored
 * design-system directory.
 *
 * @param {string[]} allStagedFiles - Paths of all staged files.
 * @returns {string[]} Shell commands lint-staged should run.
 */
const buildTasks = (allStagedFiles) => {
  const staged = allStagedFiles.filter(
    (file) => !toRepoRelative(file).startsWith(VENDORED_PREFIX),
  );
  const toFormat = staged.filter((file) => FORMAT_EXTENSIONS.test(file));
  const toLint = staged.filter((file) => LINT_EXTENSIONS.test(file));
  if (toFormat.length === 0 && toLint.length === 0) {
    return [];
  }

  const commands = [];
  if (toFormat.length > 0) {
    commands.push(`bun fmt ${toFormat.map(quote).join(" ")}`);
  }
  if (toLint.length > 0) {
    commands.push(`oxlint --fix ${toLint.map(quote).join(" ")}`);
  }
  return commands;
};

export default buildTasks;
