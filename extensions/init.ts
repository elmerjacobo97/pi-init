import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('init', {
    description: 'Create or update AGENTS.md for this repository',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /init when the agent is idle.', 'warning');
        return;
      }

      const extraInstructions = args.trim();

      const prompt = `
Create or update AGENTS.md for this repository.

The goal is a compact instruction file that helps future Pi sessions
avoid mistakes and ramp up quickly.

Every line should answer:

"Would an agent likely miss this without help?"

If not, leave it out.

${
  extraInstructions
    ? `## User-provided focus or constraints

${extraInstructions}
`
    : ''
}

## How to investigate

First determine the repository type, languages, frameworks, package
managers, build systems, and workspace structure from actual evidence.

Read the highest-value sources first:

- README files
- root manifests and dependency files
- workspace and monorepo configuration
- lockfiles
- build configuration
- test configuration
- linting and formatting configuration
- type-checking configuration
- code generation configuration
- CI/CD workflows
- pre-commit hooks and task runner configuration
- environment examples
- existing instruction files:
  - AGENTS.md
  - CLAUDE.md
  - .cursor/rules/
  - .cursorrules
  - .github/copilot-instructions.md
- repo-local AI agent configuration when present

Examples of possible ecosystem files include:

- package.json
- pnpm-workspace.yaml
- turbo.json
- tsconfig.json
- pyproject.toml
- requirements.txt
- Cargo.toml
- go.mod
- pubspec.yaml
- composer.json
- pom.xml
- build.gradle
- settings.gradle
- Package.swift
- Gemfile
- Makefile
- Dockerfile
- docker-compose files

These are examples only.

Do not assume a specific ecosystem and do not search for irrelevant
configuration files.

If architecture is still unclear after reading configuration and
documentation, inspect a small number of representative source files.

Prefer files that reveal:

- real entrypoints
- package boundaries
- application boundaries
- dependency direction
- execution flow
- shared infrastructure

Do not read random leaf files unless necessary.

Prefer executable sources of truth over prose.

If documentation conflicts with configuration, scripts, CI, or actual
code behavior, trust the executable source and only keep information
you can verify.

Do not blindly inspect the entire repository.

## What to extract

Look for the highest-signal facts for an agent working in this repo:

- exact developer commands
- non-obvious commands
- how to run a single test
- how to run a single package or application
- focused lint, type-check, test, or build commands
- required command order when it matters
- monorepo or multi-package boundaries
- ownership and purpose of major directories
- real application and library entrypoints
- dependency boundaries
- generated code and codegen workflows
- migrations
- build artifacts
- special environment loading
- required local services
- dev server quirks
- infrastructure or deployment flow
- repo-specific style conventions
- workflow conventions that differ from ecosystem defaults
- testing prerequisites
- fixtures
- integration test requirements
- snapshot workflows
- expensive or special test suites
- important constraints from existing instruction files

Good AGENTS.md content is usually context that required reading multiple
files to infer and would otherwise cause an agent to make a mistake.

## Questions

Only ask the user questions if the repository cannot answer something
important.

Ask at most one short batch of questions.

Good questions include:

- undocumented team conventions
- branch, PR, or release expectations
- missing setup requirements
- test prerequisites known by the team but absent from the repository

Do not ask about anything the repository already makes clear.

If questions are unnecessary, continue without asking.

## Writing rules

AGENTS.md must be:

- concise
- high-signal
- repository-specific
- actionable
- easy for another coding agent to scan

Include only guidance such as:

- exact commands an agent might otherwise guess incorrectly
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements
- environment quirks
- operational gotchas
- validation workflows
- important boundaries and constraints
- references to existing instruction sources that matter

Exclude:

- generic software engineering advice
- long tutorials
- exhaustive directory trees
- obvious language conventions
- framework documentation
- speculative claims
- unverified assumptions
- information that is obvious from a filename
- duplicated documentation that is better referenced elsewhere

When in doubt, omit.

Prefer short sections and bullet points.

If the repository is simple, keep AGENTS.md very small.

If the repository is large, summarize only the structural facts that
actually change how an agent should work.

## Existing AGENTS.md

If AGENTS.md already exists:

- read it first
- improve it in place
- preserve verified useful human-written guidance
- preserve intentional team rules
- remove fluff and duplication
- remove stale claims only when repository evidence clearly proves they
  are outdated
- reconcile instructions with the current codebase
- do not rewrite the file blindly

If CLAUDE.md or other agent instruction files exist:

- use them as context
- preserve relevant project-specific constraints
- do not modify them
- avoid unnecessary duplication

## Safety

- Do not invent information.
- Do not guess conventions.
- Do not install dependencies.
- Do not run destructive commands.
- Do not modify files other than AGENTS.md.
- Do not make unrelated code changes.

After updating AGENTS.md, briefly summarize:

- what repository type you detected
- the most important architecture or workflow facts discovered
- what you added, changed, or preserved in AGENTS.md
`.trim();

      pi.sendUserMessage(prompt);
    },
  });
}
