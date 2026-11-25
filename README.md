# Equipment desk homework 2–3

A standalone starter for second-year DRIP students.
Goal: build API operations that respect the available stock, connect them to the UI,
and check persistence and failures.

Start with the Russian [assignment](assignment.md).
Use the [acceptance scenarios](acceptance.md) to check your result.
The PR form is in [.github/pull_request_template.md](.github/pull_request_template.md).

Use Node.js 22.18+ and npm 10+. Run commands in this folder:

```bash
npm ci
npm run dev:api
```

Keep the API running. In a second terminal, in this folder:

```bash
npm run dev
```

Open http://127.0.0.1:5173. The initial journal shows Alina and Boris.
GET and file storage work. Issue and return actions are unfinished;
the assignment lists these boundaries.

```bash
npm run build
npm run preview
```

Preview uses http://127.0.0.1:4173 and also needs the API.
This folder is the root of a separate homework repository.
It does not import files from practice or from other homework projects.
Completed practice is required for submission, not for running this starter.

[Project structure](docs/project.md) · [Minimal npm setup](npm-setup.md) · [Help rules](AGENTS.md)
