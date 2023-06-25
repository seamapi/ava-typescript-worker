# ava-typescript-worker

[AVA](https://github.com/avajs/ava) has a really cool feature called [shared workers](https://github.com/avajs/ava/blob/843644b10fa2d3a9e6449f6022c40119c22fc9cf/docs/recipes/shared-workers.md).

But when using TypeScript and AVA with on-the-fly transpilation with something like [tsx](https://www.npmjs.com/package/tsx), loaded worker files are not transpiled--meaning you're limited to just using Javascript.

This library fixes that and allows you to register and load TypeScript workers.

## Installation

```bash
npm install ava-typescript-worker --save-dev
```

or

```bash
yarn add ava-typescript-worker --dev
```

## Usage

For the most part, shared workers behave identically with a few differences.

Here's an example of what a worker might look like:

`test.ts`:

```typescript
import test from "ava"
import { registerSharedTypeScriptWorker } from "ava-typescript-worker"
import path from "path"

const worker = registerSharedTypeScriptWorker({
  filename: path.resolve("echo.worker.ts"),
})

test("is worker available", async (t) => {
  await worker.available()
  t.pass()
})
```

`echo.worker.ts`:

```typescript
import { SharedWorker } from "ava/plugin"

const echo = async (protocol: SharedWorker.Protocol) => {
  for await (const msg of protocol.subscribe()) {
    msg.reply(msg.data)
  }
}

export default echo
```

Notice that:

- `supportedProtocols` cannot be passed as an option to `registerSharedTypeScriptWorker()`
- Workers don't need to do protocol negotiation with `await negotiateProtocol(["ava-4"]).ready()`

This is because TypeScript files are loaded through a Javascript "proxy" loader, which handles protocol negotiations out of necessity.
