<p style="text-align: center;"><img src="./assets/open-system.png" width="100%" altText="open-system"></p>

This repository contains modern and scalable web application code, additional utility applications/tools, and various libraries.

[![gitlab](https://img.shields.io/badge/version-0.0.0-orange?style=for-the-badge&logo=gitlab&logoWidth=20)](https://git.devops.broadridge.net/FXL/tfs/7.5)
[![.Net](https://img.shields.io/badge/.NET-4.7.2-blue?style=for-the-badge&logo=dotnet&logoWidth=20)](https://dotnet.microsoft.com/en-us/)
[![Nx](https://img.shields.io/badge/Nx-14.4.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20)](http://nx.dev/)
[![TypesScript](https://img.shields.io/badge/TypeScript-4.5.2-informational?style=for-the-badge&logo=typescript&logoWidth=20)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-9cf?style=for-the-badge&logo=react&logoWidth=20)](https://reactjs.org/)
[![React Query](https://img.shields.io/badge/React%20Query-3.39.2-red?style=for-the-badge&logo=reactquery&logoWidth=20)](https://react-query.tanstack.com/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.31.3-ff69b4?style=for-the-badge&logo=reacthookform&logoWidth=20)](https://react-hook-form.com/)
[![semanticrelease](https://img.shields.io/badge/Semantic%20Release-1.13.0-lightgrey?style=for-the-badge&logo=semanticrelease&logoWidth=20)](https://github.com/TheUnderScorer/nx-semantic-release)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.0-brightgreen?style=for-the-badge&logo=openapiinitiative&logoWidth=20)](https://www.openapis.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.24-9cf?style=for-the-badge&logo=tailwindcss&logoWidth=20)](https://tailwindcss.com/)
[![Commitlint](https://img.shields.io/badge/Commitlint-17.0.3-lightgrey?style=for-the-badge&logo=commitlint&logoWidth=20)](https://commitlint.js.org/#/)
[![formatted with prettier](https://img.shields.io/badge/formatted_with-prettier-ff69b4.svg?style=for-the-badge&logo=prettier)](https://prettier.io/)
[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs)](https://docusaurus.io/)

## Getting started

Once the code is pulled locally, open a command prompt and run `npm install` in the root repo directory (/open-system).

More information can be found in the [Open System documentation](https://sullivanpj.github.io/open-system/docs/getting-started/installation).

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

# Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please reach out to Patrick.Sullivan.

## Plug-Ins

This repository uses the below plug-ins:

- [@nrwl/react](https://reactjs.org)
- [@nrwl/lint](https://nx.dev/linter/overview)
- [@nrwl/js](https://nx.dev/js/overview)
- [@nrwl/node](https://nodejs.org)
- [@nrwl/web](https://nx.dev/web/overview)
- [@nrwl/storybook](https://nx.dev/storybook/overview-react)

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@open-system/my-lib`.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
