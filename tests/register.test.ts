import test from 'ava'
import { registerSharedTypeScriptWorker } from 'index'
import path from 'path'

test('registers worker', async t => {
  const worker = registerSharedTypeScriptWorker({
    filename: path.resolve('tests/workers/random.worker.ts'),
  })

  const msg = await worker.subscribe().next()
  t.is(typeof msg.value.data, 'string')
})

test('retains initialData', async t => {
  const worker = registerSharedTypeScriptWorker({
    filename: path.resolve('tests/workers/echo-initial-data.worker.ts'),
    initialData: {
      foo: 'bar'
    }
  })

  const msg = await worker.subscribe().next()
  t.deepEqual(msg.value.data, {
    foo: 'bar'
  })
})

test('works with URL', async t => {
  const worker = registerSharedTypeScriptWorker({
    filename: new URL(`file:${path.resolve('tests/workers/random.worker.ts')}`),
  })

  const msg = await worker.subscribe().next()
  t.is(typeof msg.value.data, 'string')
})
