# pi-init

A project bootstrap and validation toolkit for [Pi](https://pi.dev).

`pi-init` adds commands that help Pi understand, maintain, diagnose, and validate a repository without relying on generic assumptions.

## Commands

### `/init`

Create or improve `AGENTS.md` for the current repository.

```text
/init
```

You can also provide additional focus:

```text
/init focus on architecture
```

The generated `AGENTS.md` is intentionally compact and high-signal.

The guiding principle is:

> Would an agent likely miss this without help?

If not, it should not be included.

---

### `/init update`

Update an existing `AGENTS.md` using the current repository as the source of truth.

```text
/init update
```

You can provide additional focus:

```text
/init update focus on testing workflows
```

Update mode preserves useful human-written guidance while checking for:

- stale commands
- outdated architecture notes
- duplicated guidance
- obsolete workflows
- missing high-signal instructions
- repository changes that affect future coding sessions

It does not blindly rewrite `AGENTS.md`.

---

### `/init check`

Audit `AGENTS.md` against the current repository without modifying anything.

```text
/init check
```

You can also focus the audit:

```text
/init check focus on monorepo boundaries
```

The command returns one of:

```text
UP TO DATE
NEEDS UPDATE
UNABLE TO VERIFY
```

If changes are needed, it recommends running:

```text
/init update
```

`/init check` is read-only.

---

### `/doctor`

Diagnose the repository's development setup and workflows.

```text
/doctor
```

Optional focus:

```text
/doctor focus on local setup
```

It can inspect:

- package manager and manifests
- runtime and language versions
- workspace or monorepo configuration
- development scripts
- build configuration
- linting and formatting
- type-checking
- testing
- code generation
- migrations
- environment requirements
- required local services
- Docker configuration
- CI/CD workflows
- pre-commit hooks
- task runners

`/doctor` does not modify files or install dependencies.

---

### `/validate`

Run the validation checks that already exist in the repository.

```text
/validate
```

Optional focus:

```text
/validate focus on registry package
```

`pi-init` first determines which validation commands actually exist.

Typical checks may include:

```text
lint
typecheck
test
build
```

If CI defines an explicit validation order, that order is preferred.

Otherwise, the default preference is:

```text
lint -> typecheck -> test -> build
```

Checks that do not exist are skipped.

The final result is one of:

```text
VALID
VALIDATION FAILED
PARTIALLY VALIDATED
```

`/validate` does not automatically fix errors or modify project files.

## Installation

Install directly from GitHub:

```bash
pi install git:github.com/elmerjacobo97/pi-init
```

Then start Pi inside a repository:

```bash
pi
```

The following commands will be available:

```text
/init
/doctor
/validate
```

`update` and `check` are modes of `/init`, so they are used as:

```text
/init update
/init check
```

## Updating

If you already installed `pi-init` and a newer version is available:

```bash
pi update --extensions
```

If Pi is already running, reload extensions:

```text
/reload
```

## How it works

`pi-init` is implemented as a set of Pi extensions.

The package currently provides:

```text
extensions/
├── init.ts
├── doctor.ts
└── validate.ts
```

Each extension registers a command using Pi's extension API.

For example:

```ts
pi.registerCommand('init', {
  // ...
});
```

When a command is executed, the extension sends a specialized prompt to the active Pi session.

Pi then uses its normal repository tools to inspect the project and perform the requested task.

## Repository investigation

The commands prefer high-value sources first, including:

- README and project documentation
- dependency manifests
- lockfiles
- workspace configuration
- build configuration
- lint and formatter configuration
- type-check configuration
- test configuration
- CI/CD workflows
- task runner configuration
- environment examples
- existing agent instruction files
- representative source files when necessary

Executable sources of truth are preferred over prose.

If documentation conflicts with scripts, configuration, CI, or actual code behavior, the executable source is preferred.

The extension is designed to be ecosystem-agnostic and does not assume a specific language, framework, or package manager.

## Supported repository types

`pi-init` is designed to work across different ecosystems, including:

```text
JavaScript / TypeScript
React
Vue
Svelte
Node.js
NestJS
React Native
Flutter
PHP / Laravel
Python
Go
Rust
Java / Kotlin
Swift
monorepos
libraries
CLIs
backend services
frontend applications
mobile applications
```

Support is based on repository evidence rather than hardcoded framework assumptions.

## AGENTS.md philosophy

`pi-init` tries to keep `AGENTS.md` focused on information that materially affects an agent's work.

Good content includes:

- non-obvious commands
- focused test commands
- package boundaries
- architecture constraints
- generated code workflows
- migrations
- environment quirks
- testing prerequisites
- required local services
- CI-specific behavior
- project-specific conventions

It avoids:

- generic software advice
- framework tutorials
- exhaustive directory trees
- obvious language conventions
- speculative claims
- information easily discovered from a filename
- duplicated documentation

## Existing instructions

If `AGENTS.md` already exists, `/init` and `/init update` attempt to preserve useful human-written guidance.

Other instruction files may also be used as context when present, including:

```text
CLAUDE.md
.cursor/rules/
.cursorrules
.github/copilot-instructions.md
```

`pi-init` does not modify those files.

## Safety

The commands are designed with conservative defaults.

### `/init`

May modify:

```text
AGENTS.md
```

It should not modify unrelated project files.

### `/init check`

Read-only.

### `/doctor`

Read-only diagnostic workflow.

### `/validate`

May execute existing validation commands but should not:

- install dependencies
- modify source files
- change configuration
- run automatic fix commands
- commit changes
- run destructive commands

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

Run type checking:

```bash
pnpm typecheck
```

## Project structure

```text
pi-init/
├── extensions/
│   ├── init.ts
│   ├── doctor.ts
│   └── validate.ts
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Requirements

- Pi
- Node.js
- A Pi-compatible model capable of repository inspection

## License

MIT
