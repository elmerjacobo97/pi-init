import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('doctor', {
    description: 'Diagnose the current repository setup and workflows',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /doctor when the agent is idle.', 'warning');
        return;
      }

      const extraInstructions = args.trim();

      const prompt = `
Diagnose the current repository.

Do not modify files.

Do not install dependencies.

Do not attempt to fix anything unless the user explicitly asks later.

Inspect the repository and determine its actual development setup.

Check relevant evidence for:

- package manager and dependency manifests
- runtime or language versions
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

Identify:

1. Repository type and stack
2. Expected setup workflow
3. Important commands
4. Missing or suspicious configuration
5. Broken or inconsistent scripts
6. Version mismatches
7. Missing environment prerequisites
8. Test or build prerequisites
9. CI/local workflow mismatches
10. Any likely setup problem visible from repository evidence

Prefer executable sources of truth over documentation.

Do not speculate.

If you cannot verify a problem, label it as uncertain instead of presenting
it as a confirmed issue.

Do not run destructive commands.

You may run safe read-only or diagnostic commands when useful.

Return a concise report with:

## Environment
## Commands
## Findings
## Warnings
## Recommended next checks

Only include sections that are useful.

${extraInstructions ? `Additional focus:\n${extraInstructions}` : ''}
`.trim();

      pi.sendUserMessage(prompt);
    },
  });
}
