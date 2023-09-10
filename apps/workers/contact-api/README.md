<!-- START header -->
<!-- END header -->

# worker-contact-api

A Cloudflare Worker to be developed in the Open System monorepo.

<!-- START doctoc -->
<!-- END doctoc -->

## Build

Run to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

```
npx nx worker-contact-api:build
```

## Development server

Run for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

```
npx nx worker-contact-api:serve
```

# Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please reach out to Patrick.Sullivan.

## Deploy an application

Run to push worker changes out to Cloudflare.

```
npx nx worker-contact-api:deploy
```

## Running unit tests

Run to execute the unit tests via [Jest](https://jestjs.io).

```
npx nx worker-contact-api:test
```

## Understand your workspace

Run to see a diagram of the dependencies of your projects.

```
nx graph
```

<!-- START footer -->
<!-- END footer -->
