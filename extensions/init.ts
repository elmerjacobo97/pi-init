import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('init', {
    description: 'Create or update AGENTS.md for this repository',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /init when the agent is idle.', 'warning');
        return;
      }

      const input = args.trim();
      const isUpdate = input === 'update' || input.startsWith('update ');

      const extraInstructions = isUpdate ? input.replace(/^update\s*/, '').trim() : input;

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

AGENTS.md already exists or should be treated as an existing project
instruction file.

Read it first.

Update it in place rather than recreating it from scratch.

Preserve:
- verified useful guidance
- intentional human-written rules
- project-specific constraints
- non-obvious operational knowledge

Improve or remove:
- stale facts proven outdated by the repository
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

If architecture is still unclear, inspect a small number of representative
source files.

Prefer executable sources of truth over prose.

Do not blindly inspect the entire repository.

## What to extract

Look for high-signal facts such as:

- exact developer commands
- focused test or package commands
- required validation order
- monorepo boundaries
- real entrypoints
- dependency boundaries
- generated code
- migrations
- environment requirements
- required local services
- CI/CD flow
- repo-specific conventions
- testing prerequisites
- important constraints

## Writing rules

AGENTS.md must be:

- concise
- high-signal
- repository-specific
- actionable

Exclude:

- generic software advice
- long tutorials
- exhaustive directory trees
- speculative claims
- obvious conventions
- duplicated documentation

When in doubt, omit.

## Safety

- Do not invent information.
- Do not install dependencies.
- Do not run destructive commands.
- Do not modify files other than AGENTS.md.
- Do not make unrelated code changes.

After updating AGENTS.md, briefly summarize what changed.
`.trim();

      pi.sendUserMessage(prompt);
    },
  });
}
