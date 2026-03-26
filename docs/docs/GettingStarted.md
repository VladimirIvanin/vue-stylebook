# Getting Started

> This documentation reflects the fork of `vue-styleguidist/vue-styleguidist` maintained in this repository, with deployment targeted to GitHub Pages.

## 1. Install

Install Webpack if you don’t have it already, this is how we determine if your version of Webpack is compatible with styleguidist.

```bash
pnpm add -D webpack
```

Install Styleguidist:

```bash
pnpm add -D vue-styleguidist
```

If you use Vue CLI 3 ([@vue/cli](https://cli.vuejs.org/)), you should probably use the plugin

```sh
vue add styleguidist
```

and use [Vue CLI documentation](/VueCLI3doc.md)

## 2. Configure your style guide

Create a `styleguide.config.js` file in the same directory that your `package.json`. This will be your configuration file. In this file, you can :

- [Point Styleguidist to your Vue components](Components.md) and
- [Tell it how to load your code](Webpack.md)

If you’re using [Vue-CLI 3](https://github.com/vuejs/vue-cli) you can skip the webpack step. When you install [vue-cli-plugin-styleguidist](/VueCLI3doc.md), styleguidist picks up what it needs from the CLI. Then tell it where to find the components

## 3. Add scripts for convenience

Add these scripts to your `package.json`:

```diff
{
  "scripts": {
+    "styleguide": "vue-styleguidist server",
+    "styleguide:build": "vue-styleguidist build"
  }
}
```

For Vue-CLI 3 use this instead: 

```diff
{
  "scripts": {
+    "styleguide": "vue-cli-service styleguidist",
+    "styleguide:build": "vue-cli-service styleguidist:build"
  }
}
```

> NOTE: If you use the command `vue add styleguidist`, the scripts will be added for you in package.json.

## 4. Start your style guide

Run **`pnpm styleguide`** to start a style guide dev server.

Run **`pnpm styleguide:build`** to build a static version.

## 5. Build docs for GitHub Pages

For this fork, documentation is published to GitHub Pages. Build docs with:

```bash
pnpm predocs
pnpm docs:build
```

The static output is generated in `docs/dist`.

## 6. Start documenting your components

See how to [document your components](Documenting.md)

## Have questions

- [Read the cookbook](Cookbook.md)
- [Ask on discord](https://discordapp.com/channels/325477692906536972/538786416092512278) (requires [Vue Land](https://vue.land/) account)
- [Post Questions on Github](https://github.com/vue-styleguidist/vue-styleguidist/issues/new?template=Question.md)
