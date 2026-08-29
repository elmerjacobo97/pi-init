import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('doctor', {
    description: 'Diagnose repository setup and workflows. Usage: /doctor [focus]',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /doctor when the agent is idle.', 'warning');
        return;
      }

      const extraInstructions = args.trim();

      const prompt = `
Diagnose the current repository.

This is a diagnostic task.

Do not modify files.
Do not install dependencies.
Do not attempt to fix anything.
Do not run destructive commands.

Inspect only the repository sources necessary to understand its actual
development setup.

## Investigate

Check relevant evidence for:

- repository type
- languages and frameworks
- package manager
- dependency manifests
- runtime and language versions
- workspace or monorepo configuration
- development scripts
- build scripts
- linting
- formatting
- type-checking
- tests
- code generation
- migrations
- environment requirements
- required local services
- Docker or container setup
- CI/CD workflows
- pre-commit hooks
- task runners
- existing agent instructions

Prefer executable sources of truth over prose.

If documentation conflicts with scripts, config, CI, or actual code,
trust the executable source.

## Diagnose

Identify:

1. Repository type and stack
2. Expected setup workflow
3. Important developer commands
4. Missing or suspicious configuration
5. Broken or inconsistent scripts
6. Version mismatches
7. Missing environment prerequisites
8. Test prerequisites
9. Build prerequisites
10. CI versus local workflow mismatches
11. Likely setup problems visible from repository evidence

Do not speculate.

If something cannot be verified, mark it as uncertain.

You may run safe read-only or diagnostic commands when useful.

## Report

Return a concise report.

Use sections only when relevant:

## Environment
## Setup
## Commands
## Findings
## Warnings
## Recommended next checks

Clearly distinguish:

- confirmed problems
- potential problems
- missing information
- healthy configuration

Do not make changes.

${
  extraInstructions
    ? `## Additional focus

${extraInstructions}`
    : ''
}
`.trim();

      pi.sendUserMessage(prompt);
    },
  });
}
