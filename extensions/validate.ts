import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('validate', {
    description: 'Run existing repository validation checks. Usage: /validate [focus]',

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /validate when the agent is idle.', 'warning');
        return;
      }

      const extraInstructions = args.trim();

      const prompt = `
Validate the current repository using only validation commands that already
exist in the project.

## First inspect

Determine from repository evidence:

- package manager
- repository or workspace structure
- scripts
- lint commands
- formatting checks
- type-check commands
- test commands
- build commands
- code generation checks
- CI validation order
- package-specific validation commands

Prefer package scripts, task runners, and CI configuration as sources
of truth.

Do not invent commands.

## Execute

Run only checks that are already supported by the repository.

Typical checks may include:

- lint
- format check
- typecheck
- tests
- build

Skip checks that do not exist.

If CI defines an explicit validation order, follow it.

If no explicit order exists, prefer:

lint -> typecheck -> test -> build

For monorepos:

- prefer root-level validation when available
- otherwise use the repository's existing workspace or filter commands
- do not invent package selectors
- do not validate unrelated external directories

If the repository supports focused validation, prefer the narrowest
appropriate command when the user provided a focus.

## Failure behavior

If a command fails:

- capture the actual failure
- do not automatically fix it
- stop if later checks depend on the failed step
- continue with independent checks when useful

Clearly distinguish validation failures from unavailable checks.

## Safety

- Do not install dependencies.
- Do not modify configuration.
- Do not modify source files.
- Do not run automatic fix commands.
- Do not run destructive commands.
- Do not alter generated files.
- Do not commit anything.

## Report

Return:

## Validation summary

For each check include:

- command executed
- result: PASSED / FAILED / SKIPPED
- short explanation when failed or skipped

End with one overall result:

- VALID
- VALIDATION FAILED
- PARTIALLY VALIDATED

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
