# Sqlite Explorer

![screenshot](./assets/screenshot.png)

## Setup

Rename `.env.template` to `.env` and update the values.

## Commands

- `deno task dev`: start development server
- `deno task publish`: publish to jsr (ignore the warnings)
  - [jsx is not supported on jsr](https://github.com/jsr-io/jsr/issues/24), but it works if you use the `/** @jsxImportSource hono/jsx` pragma on all jsx files

## Installation

### Val.town

```ts
import { createApp } from "jsr:@pomdtr/val-town-sqlite-explorer@latest";

// the `valtown` env variable will be used as a token
const app = createApp();

export default app.fetch;
```

### Deno Deploy / Smallweb

```ts
import { createApp } from "jsr:@pomdtr/val-town-sqlite-explorer@latest";

const app = createApp({
    // the token is required for the app to work
    token: Deno.env.get("VALTOWN_TOKEN"),
});

export default app;
```
