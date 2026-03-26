# Deployment

Vue-Styleguidist can generate a static website. This fork is configured to publish documentation with GitHub Pages.

## Pre-requisites

First, specify the location where the styleguide site is going to be built using the [styleguideDir](/Configuration.md#styleguidedir) option. It will default to a `styleguide` folder beside your `styleguide.config.js`.

Check out the results of running the following command

```sh
pnpm predocs
pnpm docs:build
```

Now, you should have static files in `docs/dist`.

## Deploy on GitHub Pages

Use a GitHub Actions workflow that:

1. Checks out the repository.
2. Installs dependencies with `pnpm install`.
3. Builds docs with:

```sh
pnpm predocs
pnpm docs:build
```

4. Publishes `docs/dist` to GitHub Pages.

If you also build example styleguides, copy their generated output into `docs/dist` before publish (this repository does this in CI).

## Manual publish fallback

If needed, you can still build and publish manually:

```sh
pnpm predocs
pnpm docs:build
```

Then upload/publish `docs/dist` to your GitHub Pages target branch.
