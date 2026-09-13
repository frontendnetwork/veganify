"use strict";
/**
 * semantic-release configuration.
 *
 * - `main` cuts stable releases (v4.0.0, v4.0.1, …) and triggers the
 *   production rollout.
 * - `staging` cuts `rc` prereleases (v4.0.0-rc.1, …) of the version that
 *   will eventually land on `main`. No deployment happens from staging.
 *
 * Versioning starts at v4.0.0: the bun toolchain switch and the legacy-code
 * removal are breaking changes (marked with `chore!:` in the history), so
 * the first computed release is a major bump over v3.5.0.
 */
module.exports = {
  branches: ["main", { channel: "rc", name: "staging", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
  ],
};
