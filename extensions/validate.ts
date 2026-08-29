import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

export default function (pi: ExtensionAPI) {
  pi.registerCommand('validate', {
    description: "Run the repository's existing validation checks",

    handler: async (args, ctx) => {
      if (!ctx.isIdle()) {
        ctx.ui.notify('Pi is busy. Run /validate when the agent is idle.', 'warning');
        return;
      }

      const extraInstructions = args.trim();

      const prompt = `
Validate the current repository using only validation commands that already
exist in the project.

First inspect the repository to determine:

- package manager
- scripts
- workspace structure
- lint commands
- type-check commands
- test commands
- build commands
- CI validation order
- package-specific validation commands

Prefer scripts and CI configuration as sources of truth.

Then run only the checks that are appropriate and already supported by the
repository.

Typical checks may include:

- lint
- typecheck
- tests
- build

Do not invent commands.

Do not install dependencies.

Do not change configuration.

Do not modify source files.

Do not automatically fix lint or formatting errors.

Do not run destructive commands.

If CI defines an explicit validation order, follow it.

If no explicit order exists, prefer:

lint -> typecheck -> test -> build

Skip checks that do not exist.

For monorepos:

- use root-level validation when available
- otherwise use the repository's existing workspace/filter commands
- do not validate unrelated external directories

If a command fails:

- stop if continuing would make later checks meaningless
- otherwise continue when independent checks can still provide useful signal

At the end, report:

## Validation summary

For each check include:

- command executed
- result: passed / failed / skipped
- short explanation for failures

Clearly distinguish actual failures from checks that were unavailable.

${extraInstructions ? `Additional focus:\n${extraInstructions}` : ''}
`.trim();

      pi.sendUserMessage(prompt);
    },
  });
}
