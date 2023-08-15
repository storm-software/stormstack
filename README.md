<p align="center"><img src="./assets/logo-default.svg" width="100%" altText="Open System" /></p>

This repository contains modern and scalable web application code, additional utility applications/tools, and various libraries.

[![github](https://img.shields.io/github/package-json/v/sullivanpj/open-system?style=for-the-badge)](https://github.com/sullivanpj/open-system)
[![Nx](https://img.shields.io/badge/Nx-14.4.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20)](http://nx.dev/)
[![.Net Core](https://img.shields.io/badge/.NET-7.0.3-blue?style=for-the-badge&logo=dotnet&logoWidth=20)](https://dotnet.microsoft.com/en-us/)
[![NextJs](https://img.shields.io/badge/Next.js-13.0.5-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20)](https://nextjs.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.0-brightgreen?style=for-the-badge&logo=openapiinitiative&logoWidth=20)](https://www.openapis.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0.24-9cf?style=for-the-badge&logo=tailwindcss&logoWidth=20)](https://tailwindcss.com/)
[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs)](https://docusaurus.io/)
[![codecov.io](https://img.shields.io/codecov/c/github/commitizen/cz-cli.svg?style=for-the-badge)](https://codecov.io/github/commitizen/cz-cli?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint)](http://commitizen.github.io/cz-cli/)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)

<!--#if GitHubActions-->
[![GitHub Actions Build History](https://buildstats.info/github/chart/sullivanpj/open-system?branch=main&includeBuildsFromPullRequest=false)](https://github.com/sullivanpj/open-system/actions)
<!--#endif-->

### Table of Contents (via [DocToc](https://github.com/thlorenz/doctoc))
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc -->

- [Quick Features](#quick-features)
- [Resources](#resources)
- [Getting Started](#getting-started)
  - [Build](#build)
  - [Development Server](#development-server)
- [⚡Storm](#storm)
- [Environment Configuration Help](#environment-configuration-help)
  - [Plug-Ins](#plug-ins)
  - [Generate an Application](#generate-an-application)
  - [Generate a Library](#generate-a-library)
  - [Code Scaffolding](#code-scaffolding)
- [Testing](#testing)
  - [Running Unit Tests](#running-unit-tests)
  - [Running End-to-End Tests](#running-end-to-end-tests)
  - [Understand your workspace](#understand-your-workspace)
- [☁ Nx Cloud](#-nx-cloud)
  - [Distributed Computation Caching \& Distributed Task Execution](#distributed-computation-caching--distributed-task-execution)
- [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quick Features

The following are some of the features/publishable code that are included in this repository:

- Transport/protocol/backend agnostic data fetching (REST, GraphQL, promises, whatever!)
- Auto Caching + Refetching (stale-while-revalidate, Window Refocus, Polling/Realtime)
- Parallel + Dependent Queries
- Mutations + Reactive Query Refetching
- Multi-layer Cache + Automatic Garbage Collection
- Paginated + Cursor-based Queries
- Load-More + Infinite Scroll Queries w/ Scroll Recovery
- Request Cancellation
- React Suspense + Fetch-As-You-Render Query Prefetching
- Dedicated Devtools

# Resources

- [💻 Website](https://patsullivan.org)
- [📓 Documentation](https://sullivanpj.github.io/open-system)
- [🛟 Help center](https://patsullivan.org/contact)
- [🚧 Report an issue](https://patsullivan.org/contact)
- [🐱 GitHub Repository](https://github.com/sullivanpj/open-system)

# Getting Started

Once the code is pulled locally, open a command prompt and run `npm install` in the root repo directory (/open-system).

More information can be found in the [Open System documentation](https://sullivanpj.github.io/open-system/docs/getting-started/installation).

## Build

Run `nx build open-system` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Development Server

Run `nx serve open-system` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

# ⚡Storm

In the Open System, `storm` refers to a collection of applications and libraries that are used to build server-side code from a user-defined model. This functionality all lives in the Open System's `tools` directory (/tools/storm).

More information can be found in the [📓 Documentation](https://sullivanpj.github.io/open-system).


# Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please reach out to Patrick.Sullivan.

## Plug-Ins

Some of the plug-ins used by this repository are:

- [@nx/next](https://nx.dev/packages/next)
- [@nx/react](https://nx.dev/packages/react)
- [@nx/lint](https://nx.dev/linter/overview)
- [@nx/js](https://nx.dev/js/overview)
- [@nx/node](https://nodejs.org)
- [@nx/web](https://nx.dev/web/overview)
- [@nx/storybook](https://nx.dev/storybook/overview-react)
- [@nx/cypress](https://nx.dev/packages/cypress)
- [@nx/jest](https://nx.dev/packages/jest)
- And more...

## Generate an Application

Run `nx g @nx/react:app open-system` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a Library

Run `nx g @nx/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@open-system/my-lib`.

## Code Scaffolding

Run `nx g @nx/react:component my-component --project=open-system` to generate a new component.

# Testing

Open System uses [Jest](https://jestjs.io/) for unit testing and [Cypress](https://www.cypress.io/) for end-to-end testing.

## Running Unit Tests

Run `nx test open-system` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running End-to-End Tests

Run `nx e2e open-system` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of the Open System projects.

# ☁ Nx Cloud

Nx caches the output of any previously run command such as testing and building, so it can replay the cached results instead of rerunning it. Nx Cloud allows you to share the computation cache across everyone in your team and CI.

<p align="center"><img src="https://pub-4661138852db4e5da99a6660fbf9b633.r2.dev/Nx Cloud - Dashboard.png" width="100%" altText="Nx Cloud - Dashboard" /></p>

## Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/sullivanpj/open-system/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/sullivanpj/open-system/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/sullivanpj/open-system/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <a href="https://all-contributors.js.org/docs/en/bot/usage">
            <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg" />
            Add your contributions</a>
        </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
