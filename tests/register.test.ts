import test from "ava"
import { registerSharedTypeScriptWorker } from "index"
import path from "path"

test("registers worker", async (t) => {
  const worker = registerSharedTypeScriptWorker({
    filename: path.resolve("tests/workers/random.worker.ts"),
  })

  const msg = await worker.subscribe().next()
  t.is(typeof msg.value.data, "string")
})

test("retains initialData", async (t) => {
  const worker = registerSharedTypeScriptWorker({
    filename: path.resolve("tests/workers/echo-initial-data.worker.ts"),
    initialData: {
      foo: "bar",
    },
  })

  const msg = await worker.subscribe().next()
  t.deepEqual(msg.value.data, {
    foo: "bar",
  })
})

test("works with URL", async (t) => {
  const worker = registerSharedTypeScriptWorker({
    filename: new URL(`file:${path.resolve("tests/workers/random.worker.ts")}`),
  })

  const msg = await worker.subscribe().next()
  t.is(typeof msg.value.data, "string")
})

test("mirrors AVA's behavior of loading a worker multiple times for different URLs", async (t) => {
  const worker1 = registerSharedTypeScriptWorker({
    filename: new URL(
      `file:${path.resolve("tests/workers/echo-initial-data.worker.ts")}#1`
    ),
    initialData: {
      id: 1,
    },
  })

  const msg1Promise = worker1.subscribe().next()

  const worker2 = registerSharedTypeScriptWorker({
    filename: new URL(
      `file:${path.resolve("tests/workers/echo-initial-data.worker.ts")}#2`
    ),
    initialData: {
      id: 2,
    },
  })

  const msg2Promise = worker2.subscribe().next()

  const [msg1, msg2] = await Promise.all([msg1Promise, msg2Promise])

  t.is(msg1.value.data.id, 1)
  t.is(msg2.value.data.id, 2)
})
