import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('init', {
    description: 'Manage AGENTS.md. Usage: /init [update|check] [focus]',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /init when the agent is idle.', 'warning');
        return;
      }

      const input = args.trim();

      const isUpdate = input === 'update' || input.startsWith('update ');

      const isCheck = input === 'check' || input.startsWith('check ');

      const extraInstructions = isUpdate
        ? input.replace(/^update\s*/, '').trim()
        : isCheck
          ? input.replace(/^check\s*/, '').trim()
          : input;

      if (isCheck) {
        const prompt = `
Check whether AGENTS.md is still accurate for the current repository.

This is a read-only audit.

Do not modify AGENTS.md.
Do not modify any repository files.
Do not install dependencies.
Do not run destructive commands.

## Goal

Determine whether AGENTS.md contains stale, incorrect, missing, or
low-signal guidance compared with the repository as it exists now.

Read AGENTS.md first.

Then inspect only the highest-value repository sources needed to verify it:

- README files
- manifests and dependency files
- workspace or monorepo configuration
- package manager lockfiles
- build configuration
- lint configuration
- formatter configuration
- type-check configuration
- testing configuration
- code generation configuration
- CI/CD workflows
- pre-commit hooks
- task runner configuration
- environment examples
- representative source files when necessary
- relevant existing agent instruction files

Prefer executable sources of truth over prose.

If documentation conflicts with configuration, scripts, CI, or actual
code behavior, trust the executable source.

Do not inspect the entire repository unnecessarily.

## Verify

Check whether AGENTS.md is still correct regarding:

- development commands
- focused validation commands
- package manager
- repository structure
- monorepo or package boundaries
- application and library entrypoints
- architecture constraints
- dependency boundaries
- testing workflows
- required services
- environment requirements
- generated code
- migrations
- CI/CD workflows
- project-specific conventions

Also identify important high-signal information that is now present in
the repository but missing from AGENTS.md.

Do not suggest adding obvious information.

Every suggested addition should answer:

"Would an agent likely miss this without help?"

## Result

Return exactly one overall status:

- UP TO DATE
- NEEDS UPDATE
- UNABLE TO VERIFY

Then provide a concise report.

Use sections only when relevant:

## Status

## Outdated instructions

For each outdated instruction include:

- what AGENTS.md currently says
- what repository evidence shows now
- what should change

## Missing high-signal guidance

Only include information that would materially help another coding agent.

## Still valid

Briefly mention important instructions you verified as still correct.

## Recommendation

If changes are needed, recommend running:

/init update

Do not update AGENTS.md automatically.

${
  extraInstructions
    ? `## Additional focus

${extraInstructions}`
    : ''
}
`.trim();

        pi.sendUserMessage(prompt);
        return;
      }

      const prompt = `
${isUpdate ? 'Update' : 'Create or update'} AGENTS.md for this repository.

The goal is a compact instruction file that helps future Pi sessions
avoid mistakes and ramp up quickly.

Every line should answer:

"Would an agent likely miss this without help?"

If not, leave it out.

${
  isUpdate
    ? `
## Update mode

Treat AGENTS.md as an existing project instruction file.

Read it first.

Update it in place rather than recreating it from scratch.

Preserve:

- verified useful guidance
- intentional human-written rules
- project-specific constraints
- non-obvious operational knowledge

Improve or remove:

- stale facts proven outdated by repository evidence
- duplicated guidance
- low-signal prose
- commands that no longer exist
- architectural notes that no longer match the codebase

Do not rewrite working instructions merely for stylistic reasons.
`
    : ''
}

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
