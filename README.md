# pi-init

A universal `/init` command for [Pi](https://pi.dev) that creates or updates a high-signal `AGENTS.md` for your repository.

Inspired by the initialization workflows used by coding agents such as OpenCode and Claude Code.

## What it does

Running:

```text
/init
```

asks Pi to inspect the current repository and create or improve its `AGENTS.md`.

The generated instructions focus on information that future coding agents would otherwise have difficulty discovering, such as:

- Non-obvious development commands
- Monorepo and package boundaries
- Application and library entrypoints
- Build, lint, type-check, and test workflows
- How to run focused tests or packages
- Code generation and migration workflows
- Environment and local service requirements
- Repository-specific conventions
- Testing quirks and prerequisites
- Architectural constraints and operational gotchas

The guiding principle is:

> Would an agent likely miss this without help?

If not, it should not be included.

## Installation

Install directly from GitHub:

```bash
pi install git:github.com/elmerjacobo97/pi-init
```

Then start Pi inside any repository:

```bash
pi
```

and run:

```text
/init
```

## Usage

### Initialize a repository

```text
/init
```

Pi will inspect the repository and create or update:

```text
AGENTS.md
```

in the repository root.

### Provide additional focus

You can pass additional instructions:

```text
/init Pay special attention to monorepo boundaries
```

or:

```text
/init Focus on testing and validation workflows
```

These instructions are added to the initialization analysis.

## How it works

`pi-init` registers a custom Pi command using the extension API.

When `/init` is executed, it asks the active Pi agent to investigate the repository using high-value sources first, including:

- README and project documentation
- Package manifests and lockfiles
- Workspace and monorepo configuration
- Build and compiler configuration
- Linting and formatting configuration
- Testing configuration
- CI/CD workflows
- Environment configuration
- Existing agent instructions
- Representative source files when necessary

It prefers executable sources of truth such as scripts, configuration, CI, and actual code over potentially outdated documentation.

The extension does not assume a particular language, framework, package manager, or repository structure.

## Existing AGENTS.md

If an `AGENTS.md` already exists, `/init` improves it in place instead of blindly replacing it.

It attempts to:

- Preserve useful human-written instructions
- Preserve intentional project rules
- Remove unnecessary duplication
- Reconcile stale information with the current repository
- Keep the document concise and high-signal

## Safety

`/init` instructs Pi to:

- Only modify `AGENTS.md`
- Never invent project conventions
- Never install dependencies
- Never run destructive commands
- Never make unrelated code changes

## Development

Clone the repository:

```bash
git clone https://github.com/elmerjacobo97/pi-init.git
cd pi-init
```

Install dependencies:

```bash
pnpm install
```

The extension lives at:

```text
extensions/init.ts
```

## Requirements

- Pi
- Node.js
- A Pi-compatible model capable of repository inspection

## License

MIT
